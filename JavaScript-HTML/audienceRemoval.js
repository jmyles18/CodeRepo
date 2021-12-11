<script type="text/javascript">
    var consumerRemovedFromAudience = false;
    function removeFromAudience() {
        if (!consumerRemovedFromAudience && (OnetrustActiveGroups.match(/,C0004,/) == null)) {
            
            //****API CALL TO REMOVE CONSUMER FROM AUDIENCE
            
            consumerRemovedFromAudience = true;
        }       
    }
    OneTrust.OnConsentChanged(removeFromAudience);
</script>