
const usersURL = "https://moviecontest.herokuapp.com/usersjson";
//const usersURL = "http://localhost:3000/usersjson";
const divasURL = "https://moviecontest.herokuapp.com/moviesjson";
//const divasURL = "http://localhost:3000/moviesjson";

const startPage = function () {

	const x = window.location.href;
	if (x.includes("batchmovieselect")) {
		if (!x.includes("uid")) {
			window.open("batchmovie.html", "_self");
		}
	}

	if (x.includes("uid")) {
		// diva select page
		listDivas();

	} else {
		// sign in page

		var form_el = document.getElementById("divaForm");

		form_el.addEventListener("submit", function (evt) {
			evt.preventDefault();
			signUp();
		});

		var form2_el = document.getElementById("diva2Form");

		form2_el.addEventListener("submit", function (evt) {
			evt.preventDefault();
			signIn();
		});
	}
};

function listDivas() {

	const x = window.location.href;
	const u = x.toString().split("uid=");
	const y = u[1].split("&year=");
	const uid = y[0];
	const year = y[1];
	console.log("uid=" + uid);
	console.log("year=" + year);

	var buttonSubmit = document.getElementById("saveSelect");

	buttonSubmit.addEventListener("click", function (evt) {
		evt.preventDefault();
		var selectedDiva = document.getElementById('selectDivaName');
		var selectedDivaId = document.getElementById('selectDivaId');
		const diva = selectedDiva.value;
		const divaId = selectedDivaId.value;

		//console.log(diva);
		if (diva == null || diva == undefined || diva == "") return;
		//console.log("saving!");

		axios.put(usersURL + "/" + uid, {
			"moviename": diva
		}, {
			headers: {
				ADMIN: 'halina'
			}
		})
			.then(response => {
				var lblTaken = document.getElementById(diva + "2");
				lblTaken.innerHTML = "[BATCH " + year + " SELECTION]";
				buttonSubmit.setAttribute("disabled", "true");
				buttonSubmit.setAttribute("value", "CANNOT CHANGE SELECTION");
			})
			.catch(error => console.error(error));


		axios.put(divasURL + "/" + divaId, {
			"batchyrowner": year
		}, {
			headers: {
				ADMIN: 'halina'
			}
		})
			.then(response => {
				//
			})
			.catch(error => console.error(error));
	});

	axios.get(divasURL, {
		headers: {
			ADMIN: 'halina'
		}
	})
		.then(response => {
			const divas = response.data;

			var cont = document.getElementById('divas');

			divas.forEach(function (diva, index) {
				//console.log(diva.name);
				//console.log(diva.image);

				var selecttag = document.createElement("input");
				selecttag.setAttribute("type", "radio");
				selecttag.setAttribute("name", diva.name);
				selecttag.setAttribute("value", "N");
				if (diva.batchyrowner != "") {
					selecttag.setAttribute("value", "Y");
					selecttag.setAttribute("disabled", "true");
				} else {
					selecttag.addEventListener('change', function (event) {
						var selectedDiva = document.getElementById('selectDivaName');
						var selectedDivaId = document.getElementById('selectDivaId');
						//console.log(event.target);
						//console.log(event.target["name"]);
						selectedDiva.value = event.target["name"];
						selectedDivaId.value = event.target["id"];
					});
				}
				selecttag.setAttribute("id", diva.id);

				var lblName = document.createElement("label");
				lblName.setAttribute("style", "font-family: 'Avenir', cursive; font-size: 15px;");
				lblName.innerHTML = diva.name;

				var lblTaken = document.createElement("label");
				lblTaken.setAttribute("style", "font-family: 'Avenir', cursive; font-size: 15px;");
				lblTaken.setAttribute("id", diva.name + "2");
				lblTaken.innerHTML = "";
				if (diva.batchyrowner != "") {
					lblTaken.innerHTML = "[TAKEN]";
					if (diva.batchyrowner == year) {
						lblTaken.innerHTML = "[BATCH " + year + " SELECTION]";
						buttonSubmit.setAttribute("disabled", "true");
						buttonSubmit.setAttribute("value", "CANNOT CHANGE SELECTION");
					}
				}

				var hr = document.createElement("hr");
				var brr = document.createElement("br");

				var divaImg = document.createElement("img");
				divaImg.setAttribute("src", diva.image);
				divaImg.setAttribute("width", "304");
				divaImg.setAttribute("height", "228");
				divaImg.setAttribute("alt", diva.name);

				cont.appendChild(divaImg);
				cont.appendChild(brr);
				cont.appendChild(selecttag);
				cont.appendChild(document.createTextNode('\u00A0'));
				cont.appendChild(lblName);
				cont.appendChild(document.createTextNode('\u00A0\u00A0'));
				cont.appendChild(lblTaken);
				cont.appendChild(hr)

			});
		})
		.catch(error => console.error(error));
}

function signUp() {
	var msg2 = document.getElementById('msg2');
	msg2.innerHTML = "";
	var msg1 = document.getElementById('msg');
	msg1.innerHTML = "";
	var wordName = document.getElementById("wordName");
	var wordEmail = document.getElementById("wordEmail");
	var wordYear = document.getElementById("wordYear");
	var wordSection = document.getElementById("wordSection");

	var valid = true;
	// console.log("signUp with " + wordName.value);
	// console.log("signUp with " + wordEmail.value);
	// console.log("signUp with " + wordYear.value);
	// console.log("signUp with " + wordSection.value);
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
						msg1.innerHTML = "Email exists. Please sign in instead.";
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
							console.log(user);
							window.open("batchmovieselect.html?uid=" + user.id + "&year=" + user.batchyr, "_self")
						})
						.catch(error => console.error(error));
				}

			})
			.catch(error => console.error(error));
	}
}

function signIn() {
	var msg2 = document.getElementById('msg2');
	msg2.innerHTML = "";
	var msg1 = document.getElementById('msg');
	msg1.innerHTML = "";

	var word2Email = document.getElementById("word2Email");
	var word2Year = document.getElementById("word2Year");
	// console.log("signIn with " + word2Email.value);
	// console.log("signIn with " + word2Year.value);

	var valid = true;
	if (word2Email.value == null || word2Email.value == "" || !word2Email.value.includes("@")) {
		valid = false;
		msg2.innerHTML = "Email cannot be empty and should be a valid email address.";
	} else if (word2Year.value == null || word2Year.value == "" || word2Year.value.length < 4 || word2Year.value.length > 4) {
		valid = false;
		msg2.innerHTML = "Batch Year cannot be empty. Batch year must be in NNNN format (ie 1997).";
	}

	if (!valid) {
		msg2.setAttribute("class", "name");
	} else {
		axios.get(usersURL, {
			headers: {
				ADMIN: 'halina'
			}
		})
			.then(response => {
				const users = response.data;
				//console.log(`GET list users`);

				users.forEach(function (user, index) {
					//console.log(user.email);
					//console.log(user.batchyr);
					if (user.email.toLowerCase() == word2Email.value.toLowerCase() && user.batchyr == word2Year.value) {
						//console.log("match found");
						window.open("batchmovieselect.html?uid=" + user.id + "&year=" + user.batchyr, "_self")
					}
				});

				if (users.length==0) {
					msg2.setAttribute("class", "name");
					msg2.innerHTML = "Sorry, not in list. Please sign up instead.";
				}
			})
			.catch(error => console.error(error));
	}
}

$(document).ready(startPage);
