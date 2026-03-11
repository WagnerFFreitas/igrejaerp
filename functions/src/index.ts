import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import * as cors from "cors";

admin.initializeApp();

// Configurar CORS
// const corsHandler = cors({ origin: true });

// Função para criar usuário com claims customizadas
export const createUser = functions.https.onCall(async (data, context) => {
  // Verificar se o usuário é admin
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Apenas administradores podem criar usuários'
    );
  }

  const { email, password, displayName, unitId, role, employeeId, memberId } = data;

  try {
    // Criar usuário no Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // Definir claims customizadas
    const claims: any = {
      unitId,
      role,
    };

    if (employeeId) claims.employeeId = employeeId;
    if (memberId) claims.memberId = memberId;
    if (role === 'admin') claims.admin = true;

    await admin.auth().setCustomUserClaims(userRecord.uid, claims);

    // Salvar dados adicionais no Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      displayName,
      unitId,
      role,
      employeeId,
      memberId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
    });

    return {
      success: true,
      uid: userRecord.uid,
      message: 'Usuário criado com sucesso'
    };
  } catch (error: any) {
    throw new functions.https.HttpsError(
      'internal',
      error.message
    );
  }
});

// Função para gerar relatórios financeiros
export const generateFinancialReport = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Usuário não autenticado'
    );
  }

  const { unitId, startDate, endDate, reportType } = data;

  try {
    const db = admin.firestore();
    const start = new Date(startDate);
    const end = new Date(endDate);

    let reportData: any = {};

    switch (reportType) {
      case 'cashFlow':
        // Buscar transações no período
        const transactionsSnapshot = await db
          .collection('units')
          .doc(unitId)
          .collection('transactions')
          .where('date', '>=', start)
          .where('date', '<=', end)
          .get();

        const transactions = transactionsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: data.type || '',
            amount: Number(data.amount) || 0,
            ...data
          };
        });

        // Calcular fluxo de caixa
        const income = transactions
          .filter(t => t.type === 'INCOME')
          .reduce((sum, t) => sum + t.amount, 0);

        const expense = transactions
          .filter(t => t.type === 'EXPENSE')
          .reduce((sum, t) => sum + t.amount, 0);

        reportData = {
          period: { startDate, endDate },
          summary: {
            totalIncome: income,
            totalExpense: expense,
            netBalance: income - expense,
            transactionCount: transactions.length
          },
          transactions
        };
        break;

      case 'accountsPayable':
        // Buscar contas a pagar
        const payablesSnapshot = await db
          .collection('units')
          .doc(unitId)
          .collection('payables')
          .where('dueDate', '>=', start)
          .where('dueDate', '<=', end)
          .get();

        const payables = payablesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            amount: Number(data.amount) || 0,
            dueDate: data.dueDate || '',
            status: data.status || '',
            ...data
          };
        });

        const totalPayables = payables.reduce((sum, p) => sum + p.amount, 0);

        reportData = {
          period: { startDate, endDate },
          summary: {
            totalPayables,
            count: payables.length,
            overdueCount: payables.filter(p => 
              new Date(p.dueDate) < new Date() && p.status !== 'PAID'
            ).length
          },
          payables
        };
        break;

      case 'accountsReceivable':
        // Buscar contas a receber
        const receivablesSnapshot = await db
          .collection('units')
          .doc(unitId)
          .collection('receivables')
          .where('dueDate', '>=', start)
          .where('dueDate', '<=', end)
          .get();

        const receivables = receivablesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            amount: Number(data.amount) || 0,
            dueDate: data.dueDate || '',
            status: data.status || '',
            ...data
          };
        });

        const totalReceivables = receivables.reduce((sum, r) => sum + r.amount, 0);

        reportData = {
          period: { startDate, endDate },
          summary: {
            totalReceivables,
            count: receivables.length,
            overdueCount: receivables.filter(r => 
              new Date(r.dueDate) < new Date() && r.status !== 'PAID'
            ).length
          },
          receivables
        };
        break;
    }

    return {
      success: true,
      data: reportData
    };
  } catch (error: any) {
    throw new functions.https.HttpsError(
      'internal',
      error.message
    );
  }
});

// Função para backup automático
export const scheduledBackup = functions.pubsub
  .schedule('0 2 * * *') // Todos os dias às 2h da manhã
  .timeZone('America/Sao_Paulo')
  .onRun(async (context) => {
    try {
      const db = admin.firestore();
      const backupData: any = {};

      // Buscar todas as unidades
      const unitsSnapshot = await db.collection('units').get();
      
      for (const unitDoc of unitsSnapshot.docs) {
        const unitId = unitDoc.id;
        backupData[unitId] = {};

        // Backup de cada coleção
        const collections = ['employees', 'members', 'transactions', 'payables', 'receivables', 'assets'];
        
        for (const collectionName of collections) {
          const collectionSnapshot = await db
            .collection('units')
            .doc(unitId)
            .collection(collectionName)
            .get();

          backupData[unitId][collectionName] = collectionSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }
      }

      // Salvar backup no Storage
      const bucket = admin.storage().bucket();
      const fileName = `backups/backup-${new Date().toISOString().split('T')[0]}.json`;
      const file = bucket.file(fileName);

      await file.save(JSON.stringify(backupData), {
        metadata: {
          contentType: 'application/json',
        },
      });

      console.log(`Backup realizado: ${fileName}`);
      return null;
    } catch (error) {
      console.error('Erro no backup automático:', error);
      return null;
    }
  });

// Função para processar folha de pagamento
export const processPayroll = functions.https.onCall(async (data, context) => {
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Apenas administradores podem processar folha de pagamento'
    );
  }

  const { unitId, month, year } = data;

  try {
    const db = admin.firestore();

    // Buscar funcionários ativos
    const employeesSnapshot = await db
      .collection('units')
      .doc(unitId)
      .collection('employees')
      .where('isActive', '==', true)
      .get();

    const payrollData = employeesSnapshot.docs.map(doc => ({
      employeeId: doc.id,
      ...doc.data()
    }));

    // Processar cálculos da folha
    const processedPayroll = payrollData.map((employee: any) => {
      const baseSalary = employee.salario_base || 0;
      
      // Cálculos simplificados (aplicar regras reais conforme necessário)
      const inss = calculateINSS(baseSalary);
      const irrf = calculateIRRF(baseSalary - inss);
      const fgts = baseSalary * 0.08;

      return {
        employeeId: employee.employeeId,
        employeeName: employee.employeeName,
        month,
        year,
        baseSalary,
        deductions: {
          inss,
          irrf,
          fgts
        },
        netSalary: baseSalary - inss - irrf,
        processedAt: admin.firestore.FieldValue.serverTimestamp()
      };
    });

    // Salvar folha processada
    const payrollRef = await db
      .collection('units')
      .doc(unitId)
      .collection('payroll')
      .add({
        month,
        year,
        employees: processedPayroll,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        processedBy: context.auth.uid
      });

    return {
      success: true,
      payrollId: payrollRef.id,
      employees: processedPayroll.length
    };
  } catch (error: any) {
    throw new functions.https.HttpsError(
      'internal',
      error.message
    );
  }
});

// Funções auxiliares para cálculos
function calculateINSS(salary: number): number {
  if (salary <= 1412) return salary * 0.075;
  if (salary <= 2666.68) return salary * 0.09 - 21.18;
  if (salary <= 4000.03) return salary * 0.12 - 101.18;
  if (salary <= 7786.02) return salary * 0.14 - 181.18;
  return 7786.02 * 0.14 - 181.18; // Teto
}

function calculateIRRF(baseSalary: number): number {
  if (baseSalary <= 2259.20) return 0;
  if (baseSalary <= 2826.65) return baseSalary * 0.075 - 169.44;
  if (baseSalary <= 3751.05) return baseSalary * 0.15 - 381.44;
  if (baseSalary <= 4664.68) return baseSalary * 0.225 - 662.77;
  return baseSalary * 0.275 - 896.00;
}
