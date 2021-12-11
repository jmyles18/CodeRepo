function loadContextualVendorList(host) {
    document.getElementById("ot-pc-content").style.display = "none"
    // Loop through the Domain Data Groups (C0001,C0002 etc...). We're doing that to understand which Cookie category is the Vendor V9 belonging
    for (i = 0; i < OneTrust.GetDomainData().Groups.length; i++) {
        // console.log(OneTrust.GetDomainData().Groups[i])
        // Loop throught the General Vendors of each Cookie Category
        for (g = 0; g < OneTrust.GetDomainData().Groups[i].GeneralVendorsIds.length; g++) {
            //   console.log(OneTrust.GetDomainData().Groups[i].GeneralVendorsIds[g])
            // If the General Vendor == host then we store the Optanon Group Id in a variable to be able to click on the "View Vendor Details" link of the specific category
            if (OneTrust.GetDomainData().Groups[i].GeneralVendorsIds[g] == host) {
                // console.log("found!!!!!")
                var groupToClick = OneTrust.GetDomainData().Groups[i].OptanonGroupId
            }
        }
    }
    // Looping through the View Vendor Details Links to find the right one. We need to click on it to display the relevant Vendors and find the one we're interested in
    Array.from(document.getElementsByClassName("ot-link-btn category-host-list-handler")).forEach(itemHost => {
        if (itemHost.attributes["data-parent-id"].value == groupToClick) {
            // console.log(itemHost)
            itemHost.click();
        }
    })
    // Creating an array from the list of Vendor items checkboxes in the relevant group
    Array.from(document.querySelectorAll('[class="' + 'ot-chkbox ot-host-tgl' + '"]')).forEach(item => {
        // console.log(item.childNodes)
        //For each we're getting the list of child Nodes because one of the child Nodes actually include the Vendor hostid attribute and that's how we identify which ones have to be hidden and which one has to stay
        let itemChildNodes = item.childNodes;
        // console.log(itemChildNodes)
        Array.from(itemChildNodes).forEach(itemChild => {
            if (itemChild.attributes) {
                if (itemChild.attributes["hostid"]) {
                    // console.log(itemChild.attributes["name"]
                    // If the hostid value == the host we passed as a parameter
                    if (itemChild.attributes["hostid"].value !== host) {
                        //   console.log("true")
                        // If the value is not equal to the host parameter we need to get the root element of the element to hide it
                        item.parentElement.parentElement.parentElement.style.display = "none"
                    }
                }
            }
        })
    })
    //  We also hide the back Button handler so that the user can only make a selection for the specific Vendor host passed as a parameter
    document.querySelectorAll('[class="' + 'ot-link-btn back-btn-handler' + '"]')[0].style.display = "none"
    document.getElementById("ot-sel-blk").style.display = "none"
    document.getElementById("filter-btn-handler").style.display = "none"
    Optanon.ToggleInfoDisplay();
    //  Add listeners to the Confirm my Choices button and the X button so that we resurface the first visual layer of the PC and the Back Arrown Button
    [document.getElementsByClassName("save-preference-btn-handler onetrust-close-btn-handler")[0], document.getElementById("close-pc-btn-handler")].forEach(element => {
        element.addEventListener('click', event => {
            document.getElementById("ot-pc-content").style.display = "block";
            document.querySelectorAll('[class="' + 'ot-link-btn back-btn-handler' + '"]')[0].style.display = "block";
            document.getElementById("ot-sel-blk").style.display = "block"
            document.getElementById("filter-btn-handler").style.display = "block"

        })
    })
}

window.addEventListener("banner-loaded", event => {
    // Everytime there's an interaction with OptanonWrapper this function is called. It checks the OneTrustActiveGroups and create or delete the Iframe accordingly
    if (OnetrustActiveGroups.includes("V3")) {
        if (!(document.getElementById("iframeYoutube"))) {
            console.log("NoIFrame")
            iframeNew = document.createElement("iframe")
            iframeNew.setAttribute("src", "https://www.youtube.com/embed/pVu_IdDvlpI")
            iframeNew.setAttribute("id", "iframeYoutube")
            iframeNew.setAttribute("style", "height:" + "315" + "px" + ";" + "width:" + "560" + "px" + ";") //+ "position:absolute"
            var youTubeVideoDiv = document.getElementById("youtubeVideoDiv");
            youTubeVideoDiv.style = "height: 25em;"
            youTubeVideoDiv.appendChild(iframeNew)
            document.getElementById("buttonContextual").remove()

        }
    } else if (!(OnetrustActiveGroups.includes("V3"))) {
        console.log("Doesn'tIncludeV5")
        if (document.getElementById("iframeYoutube")) {
            console.log("iframeremove")
            document.getElementById("iframeYoutube").remove()
            var button = document.createElement('button')
            button.setAttribute("id", "buttonContextual")
            button.setAttribute("onClick", "loadContextualVendorList('V3')")
            button.textContent = "We need your consent to display the video. Please click the button to view details."
            var youTubeVideoDiv = document.getElementById('youtubeVideoDiv')
            youTubeVideoDiv.style = ""
            youTubeVideoDiv.appendChild(button)


        }
    }
    // Everytime there's an interaction with OptanonWrapper this function is called. It checks the OneTrustActiveGroups and create or delete the Iframe accordingly
    if (OnetrustActiveGroups.includes("V6")) {
        if (!(document.getElementById("iframeGoogleMaps"))) {
            console.log("NoIFrame")
            iframeNew = document.createElement("iframe")
            iframeNew.setAttribute("src", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2669.657172034943!2d11.35181191601366!3d48.00101217921269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479dd026a1469b3f%3A0x88cd9c338428ca48!2sM%C3%BCnchnerstra%C3%9Fe+33%2C+82319+Starnberg%2C+Deutschland!5e0!3m2!1sde!2sat!4v1470064363127")
            iframeNew.setAttribute("id", "iframeGoogleMaps")
            iframeNew.setAttribute("style", "border:0" + "allowfullscreen:'';" + "width:100%;" + "height=200" + "frameborder=0")
            var GoogleMapsDiv = document.getElementById("GoogleMapsDiv");
            // youTubeVideoDiv.style = "height: 25em;"
            GoogleMapsDiv.appendChild(iframeNew)
            document.getElementById("buttonContextualGoogleMaps").remove()


        }
    } else if (!(OnetrustActiveGroups.includes("V6"))) {
        console.log("Doesn'tIncludeV6")
        if (document.getElementById("iframeGoogleMaps")) {
            console.log("iframeGoogleMapsremove")
            document.getElementById("iframeGoogleMaps").remove()
            var button = document.createElement('button')
            button.setAttribute("id", "buttonContextualGoogleMaps")
            button.setAttribute("onClick", "loadContextualVendorList('V6')")
            button.setAttribute("style", "color:black;")
            button.textContent = "Für das Anzeigen des Videos benötigen wir Ihre Einwilligung. Bitte klicken Sie auf den Button, um Details einzusehen."
            document.getElementById('GoogleMapsDiv').appendChild(button)


        }
    }
})