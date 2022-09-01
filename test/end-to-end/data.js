const userTest = {
  user1: {
    name: 'johndoe1@gmail.com',
    password: 'une'
  },
  user1Update: {
    name: 'johndoe@imaworldhealth.org',
  }
};

const projectTest = {
  project1: {
    code: "CDH047",
    name: "OFDA PepKit"
  },
  project1Update: {
    "code": "CDH047",
    "short_name": "NMF3"
  },
  project2: {
    "code": "CD0039",
    "name": "ASSR",
    "short_name": "ASSR"
  },
  project3: {
    "code": "CDTEST",
    "name": "project test",
    "short_name": "P-test"
  },
  project4: {
    "code": "CDH046",
    "short_name": "NMF3"
  },
};

const serviceTest = {
  service: {
    uuid: "ef24cf1a-d5b9-4826-b78c-520e01c5e234",
    name: "Logistique1"
  },
  serviceUpdate: {
    name: "Logistique"
  },
  service2: {
    uuid: "ad24cf1a-d4s9-4826-b78c-520t01s7e001",
    name: "Finance",
  },
  service3: {
    uuid: "ad24cf1a-d4s9-4826-b78c-520t01s7e001",
    name: "Test",
  },
};

const officeTest = {
  office: {
    uuid: "hf24ff1f-s5b9-4826-b78c-520e01c5e234",
    code: "HQ01",
    name: "USA",
    adress: '123 Kal avenue City'
  },
  officeUpdate: {
    name: "United State of America"
  },

  office2: {
    uuid: "jk24cf1v-d4s9-4826-b78c-520t01s7e001",
    code: "CD03",
    name: "KIKWIT",
  },
  office3: {
    uuid: "jk24cf1v-d4s9-4826-b78c-520t01s7e001",
    code: "CDTEST",
    name: "TEST",
  },
};

const employeeTest = {
  employeeData: {
    employee: {
      displayname: 'Johny K',
      position: 'Programmer',
      gender : 'Homme',
      phone : '+243819293001',
      dob : '12/01/1987',
      email : 'johnyk@imaworldhealth.org',
      address : '01 AV. KABILA C/LEMBA',
      number: 1,
      is_budget_holder: 1,
      service : serviceTest.serviceUpdate.name,
      office: officeTest.officeUpdate.name,
      projects : {
        first : projectTest.project1.name,
        second : projectTest.project2.name
      }
    },
    user: {
      name: 'johnyk@imaworldhealth.org',
      pwd: 'une',
    },
    projects: {
      first : projectTest.project1.name
    },
  }, 
  employeeDataUpdate: {
    employee: {
      dob: '04/04/1994',
      grade: 'Financier'
    },
    user: {
      id: 'CA211ED5B94826B78C520E01C5900001'
    },
  },
  employeeData2: {
    employee: {
      displayname: 'Aliko',
      position: 'Directeur',
      gender : 'Femme',
      phone : '+243811504118',
      dob : '01/12/1991',
      email : 'aliko@imaworldhealth.org',
      address : '01 AV. BOMA C/GOMBE',
      service : serviceTest.service2.name,
      office: officeTest.officeUpdate.name,
      projects : {
        first : projectTest.project1.name
      }
    },
    user: {
      name: 'aliko@imaworldhealth.org',
      pwd: 'une',
    },
    projects: {
      first : projectTest.project2.name
    },
  },

  employeeData3: {
    employee: {
      uuid: 'tg81dg1e-d5b1-1846-s98c-020e01c5e234',
      displayname: 'test doe',
      position: 'tester',
      office_uuid: officeTest.office2.uuid,
    },
    user: {
      name: 'test@imaworldhealth.org',
      pwd: 'une',
    },
    projects: [projectTest.project2.uuid],
  },
};

const budgetLineTest = {
  templatePath: '../../../server/lib/xlsx_templates/budget_line.xlsx',
  templatePath2: '../../../server/lib/xlsx_templates/account.xlsx',
  budgetLine: {
    uuid: 'B453FD3A9B174192A7053DC2CD681C5A', // optional
    entity_code: 'A',
    loc: '61200',
    funding_source: 'XFGS11',
    project: 'CDH046',
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
    project: projectTest.project1.name,
    office: officeTest.office.uuid,
    employee: employeeTest.employeeData.employee.displayname,
    amount: 100,
    usefulness : 'Usefulness of this PRF',
    delivery: {
      recipient: employeeTest.employeeData.employee.displayname,
      address: '12 av test, Kinshasa',
      phone: '+1003030222',
      expected_date: '12/01/2025',
      note: null,
    },
    lines: {
      first : {
        unit: 'Act',
        quantity: 1,
        unit_price: 100,
        description : 'Achat des ordinateurs',
        budgetLine : budgetLineTest.budgetLine
      }
    },
    services: {
      first : serviceTest.serviceUpdate.name
    },
    approvers: {
      first : employeeTest.employeeData.employee.displayname
    },
  },
};

prfTest.
prf2 = { 
  project: projectTest.project1.name,
  office: officeTest.officeUpdate.name,
  employee: employeeTest.employeeData.employee,
  isEdit: true,
  amount: 400,
  usefulness : 'Usefulness of this PRF',
  update_note: 'update unit price',
  delivery: {
    recipient: employeeTest.employeeData.employee.displayname,
    address: '12 av test, Kinshasa',
    phone: null,
    expected_date: '2022-01-05',
    note: null,
  },
  lines: {
    first : {
      unit: 18,
      quantity: 1,
      unit_price: 400,
      description : 'Achat des ordinateurs',
      budgetLine : budgetLineTest.budgetLine
    },
  },
  services: {
    first : serviceTest.service.name,
  },
  approvers: {
    first : employeeTest.employeeData.employee.displayname
  },
};


module.exports = {
  userTest,
  projectTest,
  serviceTest,
  officeTest,
  employeeTest,
  budgetLineTest,
  prfTest
};
