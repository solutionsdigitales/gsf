const constants = require('../server/lib/constant.json');
// const BudgetLineTest = require('./integration/budgetLine');

const userTest = {
  user: {
    name: 'admin',
    pwd: 'admin'
  }
};

const accountTest = {
  account: {
    uuid: "4EF5A6C5307F4954830C6BE2B8ADA3B4",
    code: "10081",
    title: "Cash in transit",
    short_title: "Cash in transit"
  },
  accountUpdate: {
    uuid: "4EF5A6C5307F4954830C6BE2B8ADA3B4",
    code: "10082",
  },
};

const projectTest = {
  project: {
    uuid: "ef24cf1a-d5b9-4826-b78c-520e01c5e234",
    code: "CDH04",
    name: "Sante mere enfant integre"
  },
  "projectUpdate": {
    "code": "CDH02",
    "short_name": "NMF3"
  },
  "project2": {
    "uuid": "ad24cf1a-d4s9-4826-b78c-520t01s7e001",
    "code": "CD0039",
    "name": "ASSR",
    "short_name": "ASSR"
  }
};

const serviceTest = {
  service: {
    uuid: "ef24cf1a-d5b9-4826-b78c-520e01c5e234",
    name: "Logistique1"
  },
  "serviceUpdate": {
    "name": "Logistique"
  },
  "service2": {
    "uuid": "ad24cf1a-d4s9-4826-b78c-520t01s7e001",
    "name": "Finance",
  },
};

const officeTest = {
  office: {
    uuid: "hf24ff1f-s5b9-4826-b78c-520e01c5e234",
    code: "CD01",
    name: "KINSHAS"
  },
  officeUpdate: {
    name: "KINSHASA"
  },

  office2: {
    uuid: "jk24cf1v-d4s9-4826-b78c-520t01s7e001",
    code: "CD03",
    name: "KIKWIT",
  },
};

const employeeTest = {
  templatePath: '../../server/lib/xlsx_templates/employee.xlsx',
  employeeData: {
    employee: {
      uuid: 'AF211ED5B94826B78C520E01C5E23400',
      displayname: 'John doe',
      position: 'Programmer',
      number: 1,
      is_budget_holder: 1,
      office_uuid: officeTest.office.uuid
    },
    user: {
      id: 'CA211ED5B94826B78C520E01C5900001', // optional
      name: 'johndoe@imaworldhealth.org',
      pwd: 'une',
    },
    projects: [projectTest.project.uuid],
    projectsAccess: [],
  }, employeeDataUpdate: {
    employee: {
      dob: '1990-01-01',
      email: 'johndoe@imaworldhealth.org'
    },
    user: {
      id: 'CA211ED5B94826B78C520E01C5900001'
    },
  },
  employeeData2: {
    employee: {
      uuid: 'cg21dg1e-d5b9-1846-s98c-020e01c5e234',
      displayname: 'Kalala doe',
      position: 'Manager',
      office_uuid: officeTest.office2.uuid,
    },
    user: {
      id: 'fe21fs1a-f5b9-4826-h78c-520i01g5i901', // optional
      name: 'kalaladoe@imaworldhealth.org',
      pwd: 'une',
    },
    projects: [projectTest.project2.uuid],
    projectsAccess: [],
  },

  employeeData3: {
    employee: {
      uuid: 'tg81dg1e-d5b1-1846-s98c-020e01c5e234',
      displayname: 'test doe',
      position: 'tester',
      office_uuid: officeTest.office2.uuid,
    },
    user: {
      id: 'ge21fs1a-f5b9-4826-h78c-520i01g5i819', // optional
      name: 'test@imaworldhealth.org',
      pwd: 'une',
    },
    projects: [projectTest.project2.uuid],
  },
};

const budgetLineTest = {
  templatePath: '../../server/lib/xlsx_templates/budget_line.xlsx',
  templatePath2: '../../server/lib/xlsx_templates/account.xlsx',
  budgetLine: {
    uuid: 'B453FD3A9B174192A7053DC2CD681C5A', // optional
    entity_code: 'A',
    loc: '61200',
    funding_source: 'XFGS11',
    project: 'CDH02',
    reporting_office: 'CD01',
    sub_project: '052',
    activity: '0',
    description: 'Human Ressources'
  },
  budgetLineUpdate: {
    entity_code: 'B',
    description: 'Human Ressources à temps partiel'
  },
  incorrectBudgetLine: {
    entity_code: 'A',
    loc: '61200',
    funding_source: 'XFGS11',
    reporting_office: 'CD01',
    sub_project: '052',
    activity: '0',
    description: 'Human Ressources à temps partiel'
  },
  budgetLine2: {
    uuid: 'B621FD0A9B174192A7053DC2CD681C4B',
    entity_code: 'A',
    loc: 62009,
    funding_source: 'DFP003',
    project: 'CD0039',
    reporting_office: 'CD01',
    sub_project: '39S12',
    function_code: '39F03',
    activity: '39A59',
    description: 'Support IPS to conduct audit and controle visits to HZ',
  },
  budgetLine3: {
    uuid: 'A621FD0A9B174192A7053DC1CD691C2B',
    entity_code: 'A',
    loc: 62001,
    funding_source: 'DFP003',
    project: 'CD0039',
    reporting_office: 'CD01',
    sub_project: '39S10',
    function_code: '19F03',
    activity: '39A56',
    description: 'Test',
  },
};

const prfTest = {
  prf1: {
    uuid: 'F840F6EF6D5811ECA90C00090FFE0001', // optionnal
    project_uuid: projectTest.project.uuid,
    office_uuid: officeTest.office.uuid,
    fct_office_uuid: officeTest.office.uuid,
    status_id: constants.DOCUMENT_STATUS.PENDING,
    employee: employeeTest.employeeData.employee,
    isEdit: false,
    amount: 100,
    voucher_type_id: constants.VOUCHER_TUPES.PRF,
    usefulness: 'Usefulness of this PRF',
    update_note: null,
    delivery: {
      recipient: employeeTest.employeeData.employee.displayname,
      address: '12 av test, Kinshasa',
      phone: null,
      expected_date: '2022-01-05',
      note: null,
    },
    lines: [
      {
        unit: 18,
        quantity: 1,
        unit_price: 100,
        description: 'Achat des ordinateurs',
        budgetLine: budgetLineTest.budgetLine,
        reference: 'https://www.amazon.com/dp/B01GDJ2BH6'
      },
    ],
    services: [serviceTest.service.uuid],
    approvers: [employeeTest.employeeData.employee.uuid],
  },
};

prfTest.
  prf2 = {
  uuid: 'D820F6EF6D5811ECA90C00090FFE000S',
  parent: prfTest.prf1.uuid,
  project_uuid: projectTest.project.uuid,
  office_uuid: officeTest.office.uuid,
  fct_office_uuid: officeTest.office.uuid,
  status_id: constants.DOCUMENT_STATUS.PENDING,
  employee: employeeTest.employeeData.employee,
  isEdit: true,
  amount: 400,
  usefulness: 'Usefulness of this PRF',
  voucher_type_id: constants.VOUCHER_TUPES.PRF,
  update_note: 'update unit price',
  delivery: {
    recipient: employeeTest.employeeData.employee.displayname,
    address: '12 av test, Kinshasa',
    phone: null,
    expected_date: '2022-01-05',
    note: null,
  },
  lines: [
    {
      unit: 18,
      quantity: 1,
      unit_price: 400,
      description: 'Achat des ordinateurs',
      budgetLine: budgetLineTest.budgetLine
    },
  ],
  services: [serviceTest.service.uuid],
  approvers: [employeeTest.employeeData.employee.uuid],
};

prfTest.approve1 = {
  voucher_uuid: prfTest.prf2.uuid,
  employee_uuid: employeeTest.employeeData2.employee.uuid
};

prfTest.approve2 = {
  voucher_uuid: prfTest.prf2.uuid,
  employee_uuid: employeeTest.employeeData.employee.uuid
};



const ddfTest = {
  ddf1: {
    uuid: 'F840F6EF6D5811ECA90C00090FFE0112', // optionnal
    project_uuid: projectTest.project.uuid,
    office_uuid: officeTest.office.uuid,
    fct_office_uuid: officeTest.office.uuid,
    status_id: constants.DOCUMENT_STATUS.PENDING,
    employee: employeeTest.employeeData.employee,
    isEdit: false,
    amount: 100,
    voucher_type_id: constants.VOUCHER_TUPES.PRF,
    usefulness: 'Usefulness of this PRF',
    update_note: null,
    delivery: {
      recipient: employeeTest.employeeData.employee.displayname,
      address: '12 av test, Kinshasa',
      phone: null,
      expected_date: '2022-01-05',
      note: null,
    },
    lines: [
      {
        unit: 18,
        quantity: 1,
        debit: 100,
        description: 'Achat des ordinateurs',
        budgetLine: budgetLineTest.budgetLine,
        reference: 'https://www.amazon.com/dp/B01GDJ2BH6'
      },
    ],
    services: [serviceTest.service.uuid],
    approvers: [employeeTest.employeeData.employee.uuid],
    ddf: {
      payment_method_id: 1,
      account_to_credit: accountTest.account.uuid
    }
  },
};

ddfTest.
  ddf2 = {
  uuid: 'D820F6EF6D5811ECA90C00090FFEU40S',
  parent: ddfTest.ddf1.uuid,
  project_uuid: projectTest.project.uuid,
  office_uuid: officeTest.office.uuid,
  fct_office_uuid: officeTest.office.uuid,
  status_id: constants.DOCUMENT_STATUS.PENDING,
  employee: employeeTest.employeeData.employee,
  isEdit: true,
  amount: 400,
  usefulness: 'usefulness of this PRF',
  voucher_type_id: constants.VOUCHER_TUPES.DDF,
  update_note: 'update unit price',
  delivery: {
    recipient: employeeTest.employeeData.employee.displayname,
    address: '12 av test, Kinshasa',
    phone: null,
    expected_date: '2022-01-05',
    note: null,
  },
  lines: [
    {
      unit: 18,
      quantity: 1,
      debit: 400,
      credit: 0,
      description: 'Achat des ordinateurs',
      budgetLine: budgetLineTest.budgetLine
    },
  ],
  services: [serviceTest.service.uuid],
  approvers: [employeeTest.employeeData.employee.uuid],
  ddf: {
    payment_method_id: 1,
    account_to_credit: accountTest.account.uuid
  }
};

ddfTest.approve1 = {
  voucher_uuid: prfTest.prf2.uuid,
  employee_uuid: employeeTest.employeeData2.employee.uuid
};

ddfTest.approve2 = {
  voucher_uuid: ddfTest.ddf2.uuid,
  employee_uuid: employeeTest.employeeData.employee.uuid
};

const celluleTest = {
  cellule: {
    uuid: 'A621FD0A9B174192A7053DC1CD691C1F',
    name: 'cellule Mbatakulusu',
    town_id: 'C/Nsele',
  },
  celluleUpdate: {
    name: 'Mbatakulusu',
  },
  cellule2: {
    uuid: 'A121FD0A9B174192A7053DC1CD691C1F',
    name: 'cellule Terre Jaune',
    town_id: 'C/Nsele',
  }
};

const memberTest = {
  member: {
    uuid: 'uuid123',
    lastname: 'Lodi',
    firstname: 'John',
    gender: 'M',
    address: '228 Boende C/lingwala',
    phone: '243812537702',
    joining_date: '2022-08-31',
    cellule_uuid: celluleTest.cellule.uuid,
    town_id: 'C/Nsele',
  },

  memberUpdate: {
    firstname: 'Jeremie',
  },

  member2: {
    uuid: 'uuid-11-234',
    lastname: 'Mulongo',
    firstname: 'Jeanne',
    address: '12 Matamata C/nsele',
    phone: '243812537712',
    gender: 'M',
    joining_date: '2022-09-01',
    cellule_uuid: celluleTest.cellule2.uuid,
    town_id: 'C/Nsele',
  },
};


const transactionTest = {
  transaction: {
    uuid: "ef24cf1a-d5b2-4826-b78c-525i01d5e234",
    amount: 1,
    quantity: 1,
    member_uuid: memberTest.member.uuid,
    date: '2022-08-31',
    phone: '243812537702',
    transaction_type: 'contribition_mois',
    currency: 'USD',
    currency_id: 1,
    payment_method:'CASH',
    status: 'YES',
  },

  transactionUpdate: {
    amount: 10,
  },
  transaction2: {
    uuid: "ef24cf1a-d5b9-4826-b76c-310e01c5e234",
    amount: 100,
    quantity: 1,
    member_uuid: memberTest.member.uuid,
    date: '2022-09-05',
    phone: '243800510013',
    transaction_type: 'pret',
    currency: 'USD',
    currency_id: 1,
    payment_method:'CASH',
    status: 'YES',
    reference : 'pret-001'
  },
};


module.exports = {
  userTest,
  celluleTest,
  memberTest,
  accountTest,
  projectTest,
  officeTest,
  employeeTest,
  budgetLineTest,
  serviceTest,
  transactionTest,
  prfTest,
  ddfTest,
  constants,
};
