let people;


$(window).on('load', function() {
    getData("https://script.google.com/macros/s/AKfycbwMZdsa4fz3xGy9MibJxs8e4tjSCTE8UHmTCgOVL9y8PbEO2bHj4LLFsa54R04MmPHk/exec");
})

async function getData(url) {
    let x = await fetch(url);
    let y = await x.text();

    people = JSON.parse(y);

    for (let i = 0; i < Object.keys(people).length; i++) {
        person = people[i];

        var persondata_string = `<li class="work-item ${person['WebClass']}" id="undefined" style="position: absolute; left: 0px; top: 0px;">
                <a onclick="showProfile('${person['Tag']}')">`

                if (person.hasOwnProperty("Photo") && person['Photo'] != "") {
                    persondata_string += `<div class="work-image"><img onclick="showProfile()" src="${person['Photo']}" class="profile-photo" alt="${person['Name']}"></div>`
                }

                else {
                    persondata_string += `<div class="work-image"><img onclick="showProfile()" src="hmnn-assets/photos/anonymous.jpg" class="profile-photo" alt="${person['Name']}"></div>`
                }

        persondata_string += `            <div class="team-descr font-alt">
                        <div class="team-item">
                            <div class="team-name"><h4>${person['Name']}</h4></div>
                            <div class="team-role"><h5>${person['Role']}</h5></div>
                            <div class="role-dates"><h5><i class="fa fa-fw"></i>&nbsp;${person['Dates']}</h5></div>`

        if (person.hasOwnProperty("CurrentPosition") && person['CurrentPosition'] != "") {
            persondata_string += `<div class="team-role"><h5>Current: ${person['CurrentPosition']}</h5></div>`
        }
        
        persondata_string += `</div>
                    </div>
                </a>
        
                <div class="team-item">
                    <a href="mailto:${person['Email']}" target="_blank">
                        <img width="25" height="25" src="hmnn-assets/icons/email-48.png">
                    </a>`

        if (person.hasOwnProperty("LinkedIn") && person['LinkedIn'] != "") {
            persondata_string += `&nbsp;<a href="${person['LinkedIn']}" target="_blank">
                    <img width="25" height="25" src="hmnn-assets/icons/linkedin-48.png">
                </a>
                &nbsp;`
        }

        if (person.hasOwnProperty("Twitter") && person['Twitter'] != "") {
            persondata_string += `<a href="${person['Twitter']}" target="_blank">
                    <img width="25" height="25" src="hmnn-assets/icons/twitter-48.png">
                </a>
                &nbsp;`
        }

        if (person.hasOwnProperty("Portfolio") && person['Portfolio'] != "") {
            persondata_string += `<a href="${person['Portfolio']}" target="_blank">
                    <img width="25" height="25" src="hmnn-assets/icons/linking-48.png">
                </a>`
        }
        persondata_string += `</div>
            </li>`;

        var $persondata = $(persondata_string)

        $('#works-grid').append($persondata).isotope('appended', $persondata);
    }
    
    $('#works-grid').imagesLoaded(function() {
        $('#works-grid').isotope({
            // layoutMode: worksgrid_mode,
            itemSelector: '.work-item'
        });
    });
}

function checkIfProfile() {
    if (document.querySelector("#show-profile").style.display == 'block') {
        closeProfile();
    }
}

function closeProfile() {
    document.querySelector("#show-profile").style.display = 'none';
    document.querySelector("#works-grid").style.display = 'block';
}

function showProfile(personname) {
    document.querySelector('#filters').scrollIntoView();
    document.querySelector("#works-grid").style.display = 'none';
    document.querySelector("#show-profile").style.display = 'block';

    person = people.find(e => e['Tag'] === personname);

    
    var profiledata = `
            <section class='FlexContainer'>
                <div>
                    <img onclick="closeProfile()" src="hmnn-assets/icons/close-32.png"
                        style="float: right; position:relative; cursor: pointer; z-index: 2" />
                </div>
            </section>
            <div class="person-profile">
                <div class="person-profile-left">
                    <div class="work-image">`

    if (person.hasOwnProperty("Photo") && person['Photo'] != "") {
        profiledata += `<img src="${person['Photo']}" class="profile-photo" alt="${person['Name']}">`
    }
    
    else {
        profiledata += `<img src="hmnn-assets/photos/anonymous.jpg" class="profile-photo" alt="${person['Name']}">`
    }

    profiledata += `</div>
                    <div class="team-item" style="padding:10px">
                        <a href="mailto:${person['Email']}" target="_blank">
                            <img width="25" height="25" src="hmnn-assets/icons/email-48.png">
                        </a>`

    if (person.hasOwnProperty("LinkedIn") && person['LinkedIn'] != "") {
        profiledata += `&nbsp;
                        <a href="${person['LinkedIn']}" target="_blank">
                            <img width="25" height="25" src="hmnn-assets/icons/linkedin-48.png">
                        </a>`
    }

    if (person.hasOwnProperty("Twitter") && person['Twitter'] != "") {
        profiledata += `&nbsp;
                        <a href="${person['Twitter']}" target="_blank">
                            <img width="25" height="25" src="hmnn-assets/icons/twitter-48.png">
                        </a>`
    }
    
    if (person.hasOwnProperty("Portfolio") && person['Portfolio'] != "") {
        profiledata += `&nbsp;
                        <a href="${person['Portfolio']}" target="_blank">
                            <img width="25" height="25" src="hmnn-assets/icons/linking-48.png">
                        </a>`
    }

    profiledata += `</div>
                </div>

                <div class="person-profile-right font-alt">
                    <h2>${person['Name']}</h2>
                    <hr class="divider-w mt-10 mb-20">
                    <div class="font-alt">
                        <h4>${person['Role']}&nbsp;&nbsp;&nbsp;<i class="fa fa-fw"></i>&nbsp;${person['Dates']}</h4>
                    </div>`
    if (person.hasOwnProperty("CurrentPosition") && person['CurrentPosition'] != "") {
        profiledata += `<div class="font-alt">
                        <h4>Current: ${person['CurrentPosition']}</h4>
                    </div>`
    }

    profiledata += `<br>
                    <h4>About</h4>
                    <hr class="divider-w mt-10 mb-20">
                    ${person['Description']}`

    if (person.hasOwnProperty("GraphicalAbstract") && person['GraphicalAbstract'] != "") {
        profiledata += `<br><br>
                    <img style="display: block" width="100%"
                        src="${person['GraphicalAbstract']}">`
    }
    
    if (person.hasOwnProperty("Publications") && person['Publications'] != "") {
        profiledata += `<br><br>
                    <h4>Publications</h4>
                    <hr class="divider-w mt-10 mb-20">
                    ${person['Publications']}` 
    }

    if (person.hasOwnProperty("DissertationTitle") && person['DissertationTitle'] != "") {
        profiledata += `<br><br>
                <h4>Dissertation </h4>
                <hr class="divider-w mt-10 mb-20">
                ${person['DissertationTitle']}`
    }

    if (person.hasOwnProperty("DissertationLink") && person['DissertationLink'] != "") {
        profiledata += `<br>
        <a href="${person['DissertationLink']}" target="_blank"><img width="25" height="25" src="hmnn-assets/icons/pdf-48.png" /> Read</a>`
    }

    profiledata +=  `</div>
            </div>`;

    document.querySelector("#show-profile").innerHTML = profiledata;
}
