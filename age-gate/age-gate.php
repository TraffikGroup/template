<?php require('../../../../../wp-blog-header.php');?>
<div id='header'class="text-center">
	<div class="row">
			<div class="col-sm-12">
		<img src="<?= get_template_directory_uri(); ?>/assets/images/sprites/captain-morgan.png">		
	</div>
	</div>
</div>

<div id='section-age' class="bg-gold">
	<div class="container">
		<form action="/" autocomplete="on" method="post">
			
				<div class="col-sm-12 text-center">
					
				<span class="subheader arrows">SHOW US HOW YOU</span>
				<h1>LIVE #LIKEACAPTAIN</h1>
				<span class="win"> <span class='small text-right'>AND YOU
						<br>
						COULD</span> WIN <span class="small" style="margin-top:10px;">UP
						<br>
						TO</span> $10,000* </span>
				<div class="section-break"></div>
				<p>
					<strong>(or $2000. Or $1000. 0r $500. Or many more weekly cash prizes we’re giving away...)</strong>
				</p>
					<p>
					First, we have to make sure you’re old enough to live #LikeACaptain
					</p>
				</div>
				<div class="col-xs-12">
					<div class="dob-inputs clearfix"></div>

				</div>
				<div class="col-xs-12">
				<div class="col-sm-2 col-sm-push-1 text-right">
					<label for="province-select" class="agegate-label">Location:</label>
				</div>
				<div class="col-sm-6 col-sm-push-1">
					<div class="province-div">
						<select class="province" id="province-select" name="province" tabindex="2">
							<option value="0" selected>*PROVINCE / TERRITORY</option>
							<option value="AB">Alberta</option>
							<option value="BC">British Columbia</option>
							<option value="MB">Manitoba</option>
							<option value="NB">New Brunswick</option>
							<option value="NL">Newfoundland and Labrador</option>
							<option value="NT">Northwest Territories</option>
							<option value="NS">Nova Scotia</option>
							<option value="NU">Nunavut</option>
							<option value="ON">Ontario</option>
							<option value="PE">Prince Edward Island</option>
							<option value="QC" disabled>Quebec</option>
							<option value="SK">Saskatchewan</option>
							<option value="YT">Yukon</option>
						</select>
					</div>
				</div>
				<div id="remember" class="col-sm-push-3 col-sm-5 clearfix">
					<input class="remember-me-checkbox" name="remember-me" id="remember-me" tabindex="6" type="checkbox">
					<label class="remember-me-label" for="remember-me">REMEMBER ME: Use a cookie to remember me.<br>Only check this box if you are not using shared computer.</label>
				</div>
				<div class="col-sm-12 text-center">
					<div class="buttons-wrap">
						<input class="submit btn" id="submit-gateway" value="Enter" tabindex="7" type="submit">
					</div>
				</div>
			</div></div>
		</form>

</div>

<div id='footer'class="top-rip text-center">
	<div class="row">
			<div class="col-sm-12">
				<img src="<?= get_template_directory_uri(); ?>/assets/images/party-responsibly.gif">
		<ul class="list-inline">
			<li>
				<a href="http://www.captainmorgan.com/en-ca/privacy.html" target+="_blank">Privacy Policy</a>
			</li>
			<li>
				<a href="<?= get_permalink(11); ?>">Rules and Regulations</a>
			</li>
		</ul>
		<p>
			This contest is not applicable to residents of Quebec. Must be legal drinking age to enter. Contest close date: Oct 31st, 11:59pm, 2014.
		</p>
	</div>
	</div>
</div>


<script>
	/*$('.country').live('focus', function() {
	 parent.xtrtrkr._Event('Form Events', 'Age Gateway Form', 'country', 1);
	 });

	 $('.province').live('focus', function() {
	 parent.xtrtrkr._Event('Form Events', 'Age Gateway Form', 'locale', 1);
	 });

	 $('.year').live('focus', function() {
	 parent.xtrtrkr._Event('Form Events', 'Age Gateway Form', 'year', 0);
	 });

	 $('.month').live('focus', function() {
	 parent.xtrtrkr._Event('Form Events', 'Age Gateway Form', 'month', 0);
	 });

	 $('.day').live('focus', function() {
	 parent.xtrtrkr._Event('Form Events', 'Age Gateway Form', 'day', 0);
	 });
	 */
</script>
</div>