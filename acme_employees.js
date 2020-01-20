const employees = [
	{ id: 1, name: 'moe' },
	{ id: 2, name: 'larry', managerId: 1 },
	{ id: 4, name: 'shep', managerId: 2 },
	{ id: 3, name: 'curly', managerId: 1 },
	{ id: 5, name: 'groucho', managerId: 3 },
	{ id: 6, name: 'harpo', managerId: 5 },
	{ id: 8, name: 'shep Jr.', managerId: 4 },
	{ id: 99, name: 'lucy', managerId: 1 }
];

const spacer = (text) => {
	if (!text) {
		return console.log('');
	}
	const stars = new Array(5).fill('*').join('');
	console.log(`${stars} ${text} ${stars}`);
};

spacer('findEmployeeByName Moe');
// given a name and array of employees, return employee

const findEmployeeByName = (name, employees) => {
	return employees.find((employee) => employee.name === name);
};

console.log(findEmployeeByName('moe', employees)); //{ id: 1, name: 'moe' }
spacer('');

spacer('findManagerFor Shep');
//given an employee and a list of employees, return the employee who is the manager

const findManagerFor = (employee, employees) => {
	return employees.find((manager) => manager.id === employee.managerId);
};

console.log(findManagerFor(findEmployeeByName('shep Jr.', employees), employees)); //{ id: 4, name: 'shep', managerId: 2 }
spacer('');

spacer('findCoworkersFor Larry');

//given an employee and a list of employees, return the employees who report to the same manager

const findCoworkersFor = (employee, employees) => {
	return employees.filter((coworker) => coworker.managerId === employee.managerId && coworker.id !== employee.id);
};

console.log(
	findCoworkersFor(findEmployeeByName('larry', employees), employees)
); /*
[ { id: 3, name: 'curly', managerId: 1 },
  { id: 99, name: 'lucy', managerId: 1 } ]
*/

spacer('');

spacer('findManagementChain for moe');
//given an employee and a list of employees, return a the management chain for that employee. The management chain starts from the employee with no manager with the passed in employees manager

const findManagementChainForEmployee = (employee, employees) => {
	let currentEmployee = employee;
	const managementChain = [];

	while (currentEmployee.managerId) {
		currentEmployee = findManagerFor(currentEmployee, employees);
		managementChain.unshift(currentEmployee);
	}

	return managementChain;
};

console.log(findManagementChainForEmployee(findEmployeeByName('moe', employees), employees)); //[  ]
spacer('');

spacer('findManagementChain for shep Jr.');
console.log(
	findManagementChainForEmployee(findEmployeeByName('shep Jr.', employees), employees)
); /*
[ { id: 1, name: 'moe' },
  { id: 2, name: 'larry', managerId: 1 },
  { id: 4, name: 'shep', managerId: 2 }]
*/
spacer('');

spacer('generateManagementTree');
//given a list of employees, generate a tree like structure for the employees, starting with the employee who has no manager. Each employee will have a reports property which is an array of the employees who report directly to them.

const generateManagementTree = (employees) => {
	const manager = employees.find((employee) => employee.managerId === undefined);
	let updEmployees = employees.filter((employee) => employee.id !== manager.id);

	const createTree = (employees, managerId) => {
		const reports = [];

		employees.forEach((employee, ind) => {
			if (employee.managerId === managerId) {
				updEmployees = [ ...employees.slice(0, ind), ...employees.slice(ind + 1) ];

				reports.push({ ...employee, reports: createTree(updEmployees, employee.id) });
			}
		});

		return reports;
	};

	return { ...manager, reports: createTree(employees, manager.id) };
};

console.log(JSON.stringify(generateManagementTree(employees), null, 2));
/*
{
  "id": 1,
  "name": "moe",
  "reports": [
    {
      "id": 2,
      "name": "larry",
      "managerId": 1,
      "reports": [
        {
          "id": 4,
          "name": "shep",
          "managerId": 2,
          "reports": [
            {
              "id": 8,
              "name": "shep Jr.",
              "managerId": 4,
              "reports": []
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "name": "curly",
      "managerId": 1,
      "reports": [
        {
          "id": 5,
          "name": "groucho",
          "managerId": 3,
          "reports": [
            {
              "id": 6,
              "name": "harpo",
              "managerId": 5,
              "reports": []
            }
          ]
        }
      ]
    },
    {
      "id": 99,
      "name": "lucy",
      "managerId": 1,
      "reports": []
    }
  ]
}
*/
spacer('');

spacer('displayManagementTree');
//given a tree of employees, generate a display which displays the hierarchy

const displayManagementTree = (managementTree) => {
	let level = 0;
	let result = '';

	const printTree = (managementTree, level) => {
		result += '-'.repeat(level) + managementTree.name + '\n';

		if (managementTree.reports.length > 0) {
			level++;
			managementTree.reports.forEach((managementSubTree) => {
				printTree(managementSubTree, level);
			});
		}
	};

	printTree(managementTree, level);
	console.log(result);
};

displayManagementTree(
	generateManagementTree(employees)
); /*
moe
-larry
--shep
---shep Jr.
-curly
--groucho
---harpo
-lucy
*/
