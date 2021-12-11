<script type="text/javascript">
        function readCookie(name) {                  //Function to read cookie values
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
        </script>
       
        <!--<script type="text/javascript">
        function idByWindowLoad(){
            Optanon.SetAlertBoxClosed();                  //Closes The Banner
                              //Create Consent Transaction
           
            var readOT = readCookie('OptanonConsent');    //Reading Consent Cookie Value
            console.log(readOT);
           
            document.cookie = "OptanonConsent" + "=" + readOT + "consentId=iali@onetrust.com";
           
       
       
            var findID = readOT.search('consentId=')      //Finding the Location of the Consent Id
       
            if(findID == -1){                             //Checking if Consnet Id is present
                console.log("Consent ID has not been set")
            }
            else{
                var saveID = readOT.substring(findID, findID+46) //Reading Consent Id
                console.log(saveID);
                Optanon.Close();
            }
           
        }
        window.onload = idByWindowLoad;   //Executing the function on the Window Load Event
        </script>-->