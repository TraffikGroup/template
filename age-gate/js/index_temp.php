<?php

include('config.php');

if (isset($_SERVER['HTTP_COOKIE'])) {
    $cookies = explode(';', $_SERVER['HTTP_COOKIE']);
    foreach($cookies as $cookie) {
        $parts = explode('=', $cookie);
        $name = trim($parts[0]);
        setcookie($name, '', time()-1000);
        setcookie($name, '', time()-1000, '/');
    }
}


require_once('AppInfo.php');
require_once('sdk/src/facebook.php');
require_once('utils.php');

$facebook = new Facebook(array(
    'appId' => AppInfo::appID(),
    'secret' => AppInfo::appSecret(),
));

$user_id = $facebook->getUser();
$basic = false;
if ($user_id) {
    try {
        $basic = $facebook->api('/me');
        //check_fr($facebook);
    } catch (FacebookApiException $e) {
        // If the call fails we check if we still have a user. The user will be
        // cleared if the error is because of an invalid accesstoken
        if (!$facebook->getUser()) {
//            header('Location: ' . AppInfo::getUrl($_SERVER['REQUEST_URI']) . '/index.php' );
            exit();
        }
    }
}

?>


<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">    
    <meta name="viewport" content="width=device-width, user-scalable=no"/>

    <title>Crown Royal Heritage</title>

    <meta property="og:title" content="Crown Royal Heritage"/>
    <meta property="og:image" content="images/fb_200x200.jpg"/>
    <meta property="og:site_name" content="Crown Royal Heritage"/>
    <meta property="og:description" content="Enter for a chance to win* 1 of 3 trips to the 2014 Tim Hortons NHL Heritage Classic(tm)"/>
    <meta property="og:url" content="http://crownroyalheritage.ca/" />  


    <link rel="stylesheet" href="styles/global.css"/>
    <!--[if IE]>
    <link rel="stylesheet" type="text/css" href="styles/ie.css"/>
    <![endif]-->
    <!--[if IE 7]>
    <link rel="stylesheet" type="text/css" href="styles/ie7.css"/>
    <![endif]-->
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:700,800' rel='stylesheet' type='text/css'>

    <!--Load the Age Gate stylesheet-->
    <link href="age-gate/css/age-gate.css" rel="stylesheet">
    

    <!--Include jQuery (call google hosted version or otherwise local backup-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="js/jquery-1.7.2.min.js"><\/script>')</script>    
    <!--script src="jquery.min.js" type="text/javascript"></script-->
    <script src="scripts.js" type="text/javascript"></script>

    <!--script type="text/javascript">var GatewayShown=true;</script-->
    <script type="text/javascript">var Tracked=true;</script>

  <script type="text/javascript">
      (function() {
          var xtrtrkr = document.createElement('script'); xtrtrkr.type = 'text/javascript';
          xtrtrkr.src = ('https:' == document.location.protocol ? '<?php echo "$TAGIFY_SECURE"; ?>' : '<?php echo "$TAGIFY"; ?>') + '/xtrtrkr.js';
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(xtrtrkr, s);
      })(); 
  </script>



    <script type="text/javascript">
        function logResponse(response) {
            if (console && console.log) {
                console.log('The response was', response);
            }
        }
    </script>
    <!--[if IE]>
    <script type="text/javascript">
        var tags = ['header', 'section'];
        while (tags.length)
            document.createElement(tags.pop());
    </script>
    <![endif]-->

</head>
<body>

        <!--GATEWAY CODE: START-->
        <div class="curtain"></div>
        <div class="age-gate">
            <noscript>
                <div class="panel">
                    <h1><img src="/images/guinnessBlackLOGO.png"></h1>
                    <h2>JavaScript Required</h2>
                    <p>This Guinness&nbsp;&reg; brand site requires all users to enter their date of birth for verification purposes. Please enable JavaScript in your browser and reload the page.</p>           
                </div>
            </noscript>
        </div>
        <!--GATEWAY CODE: END-->

<div id="fb-root"></div>

<div class="containerBottlePages">
  <div id="splash-container">

    <div id="splash-header"><img src="images/guinnessBlackLOGO.png" /></div>
 	
    <div class="topHeader">
        <p><img src="images/header_splash.png" /></p>
        <div id="splash-enter-button">
            <a id="enter" href="<?php echo "$SECURE_URL"; ?>/registration.php"><img src="images/enter-button.png" alt="Enter" border="0" height="68" width="237"></a>
        </div>
    </div>

    <div id="splash-image">
        <img id="desktop" src="images/bottle.png" />
        <img id="mobile" src="images/bottle_mob.png">
    </div>  

  </div>
</div>

<div class="footer-container-index">

      <div class="global-footer">
            <p>Copyright&nbsp;2014&nbsp;Diageo&nbsp;Canada</p>
            <ul>
                <li><a href="http://www.centurycouncil.org/" target="_new">Responsible&nbsp;Drinking</a></li>
                <li>|</li>
                <li><a href="http://www.drinkiq.com/" target="_new">DrinkIQ.com</a></li>
                <li>|</li>                
                <li><a href="rules_and_regulations.php" target="_new">Rules&nbsp;and&nbsp;Regulations</a></li>
                <li>|</li>
                <li><a href="privacy.php" target="_new">Privacy&nbsp;Policy</a></li>                
            </ul>
    </div>
     <div class="small-legal">
&dagger; Contest open only to residents of Canada (excluding Quebec) who have reached the legal drinking age or older at time of entry.
</div>
</div>

        <!--Include Age Gate JavaScript file-->
        <script src="age-gate/js/age-gate.js"></script>

        <!--INCLUDE html5.js and respond.min.js to support outdated browsers-->
        <!--[if lt IE 9]>
            <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js" type="text/javascript"></script>
            <script src="age-gate/js/respond.min.js" type="text/javascript"></script>
            <script src="age-gate/js/json2.js" type="text/javascript"></script>
            <script src="age-gate/js/ie.js" type="text/javascript"></script>
        <![endif]-->

        <!--Call the age gate function in your JavaScript file-->
        <script>

            agegate();

        </script>    
        

<script>
$(window).load(function () {
  xtrtrkr.Tracked = false;
  xtrtrkr.GatewayShown = true;
  xtrtrkr._GatewayShown();
  Tracked = true;
});
</script>

<script>
function ageGateCompleted() {
  xtrtrkr.Tracked = false;
  xtrtrkr.GatewayCompleted = true;
  xtrtrkr._GatewayCompleted();
}
</script>
       
                

</body>
</html>
