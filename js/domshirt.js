
const usersURL = "https://batchshirtcontest.herokuapp.com/usersjson";

const startPage = function () {

		// sign in page

		var form_el = document.getElementById("divaForm");

		form_el.addEventListener("submit", function (evt) {
			evt.preventDefault();
			signUp();
		});
};

function signUp() {
	var msg1 = document.getElementById('msg');
	msg1.innerHTML = "";
	var wordName = document.getElementById("wordName");
	var wordEmail = document.getElementById("wordEmail");
	var wordYear = document.getElementById("wordYear");
	var wordSection = document.getElementById("wordSection");

	var valid = true;

	if (wordName.value == null || wordName.value == "") {
		valid = false;
		msg1.innerHTML = "Name cannot be empty.";
	} else if (wordEmail.value == null || wordEmail.value == "" || !wordEmail.value.includes("@")) {
		valid = false;
		msg1.innerHTML = "Email cannot be empty and should be a valid email address.";
	} else if (wordYear.value == null || wordYear.value == "" || wordYear.value.length < 4 || wordYear.value.length > 4) {
		valid = false;
		msg1.innerHTML = "Batch Year cannot be empty. Batch year must be in NNNN format (ie 1997).";
	} else if (wordSection.value == null || wordSection.value == "") {
		valid = false;
		msg1.innerHTML = "Section cannot be empty.";
	} 

	if (!valid) {
		msg1.setAttribute("class", "name");
	} else {
		axios.get(usersURL, {
			headers: {
				ADMIN: 'halina'
			}
		})
			.then(response => {
				const users = response.data;
				//console.log(`GET list users`);

				let found = false
				users.forEach(function (user, index) {
					//console.log(user.email);
					//console.log(user.batchyr);
					if (user.email.toLowerCase() == wordEmail.value.toLowerCase()) {
						//console.log("year match found");
						found = true;
						msg1.setAttribute("class", "name");
						msg1.innerHTML = "Email exists. You already signed up.";
					}
				});

				console.log("found=" + found);

				if (!found) {
					console.log("new user");
					axios.post(usersURL, {
						"name": wordName.value,
						"email": wordEmail.value,
						"batchyr": wordYear.value,
						"section": wordSection.value,
						"active": "TRUE"
					}, {
						headers: {
							ADMIN: 'halina'
						}
					})
						.then(response => {
							const user = response.data;
							//console.log(user);

							var buttonSubmit = document.getElementById("shirtSignUp");
							buttonSubmit.setAttribute("disabled", "true");
							buttonSubmit.setAttribute("value", "[REGISTERED] Thank you!");
						})
						.catch(error => console.error(error));
				}

			})
			.catch(error => console.error(error));
	}
}


$(document).ready(startPage);
