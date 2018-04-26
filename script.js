const TARGET_URL = 'https://h93rvy36y7.execute-api.us-east-1.amazonaws.com/teams';
const BUTTON_TEXT = 'Press to See';

const button = document.querySelector('.goSeek');
button.innerText = BUTTON_TEXT;
const insertPoint = document.getElementById('insertPoint');
const getData = () => {
  return fetch(TARGET_URL);
};
const teamMembers = [];
const helpers = {
  //comparator is a helper method to compare the names by lastName, or firstName if lastNames are same
  comparator(member1, member2) {
    if(member1.lastName === member2.lastName) {
      return member1.firstName.localeCompare(member2.firstName);
    } else {
      return member1.lastName.localeCompare(member2.lastName);
    }
  },
  // stripper is a helper function that takes the returned JSON object
  // and returns a sorted array of names in form "firstName lastName"
  stripper(jsonObj) {
    const VirginiaLeads = jsonObj.filter(team => {
      return team.state === 'VA';
    })
    .forEach((team) => {
      teamMembers.push(...team.members.filter((member) => {
        return member.role === 'Technical Lead' || member.role === "Software Engineer";
      }));
    });
    return teamMembers.sort(this.comparator).map((val) => {
      return val.firstName + ' ' + val.lastName;
    });
  }
}

const handler = () => {
  getData()
  .then((data) => {
    data.json()
  .then((myJSON) => {
        helpers.stripper(myJSON)
        .forEach((name, ind) => {
          let el = document.createElement('p');
          el.innerText = name;
          insertPoint.appendChild(el);
          button.classList.remove('goSeek');
          button.classList.add('offSeek');
        });
      });
    });
    button.innerText = '';
    button.removeEventListener('click', handler);
  };

button.addEventListener('click', handler);
