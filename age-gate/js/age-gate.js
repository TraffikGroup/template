/*
 *	DIAGEO AGE GATE
 *	version 3.0
 *	October 2012
 */


//Self-referincing anonymous function is called on the window object

(function (win) {
	
	//Setup a namespace 'agegate' for the gateway
	win.agegate = function (args) {

		//Set the age-gate options
		//See readme for documentation on options and their values
		//DO NOT EDIT THIS CODE DIRECTLY - SET OPTIONS WHEN YOU CALL THE age-gate FUNCTIONS
		if (!(typeof args === "object")) args = {};
		var options = {
			age_gate_element:		args.age_gate_element || ".age-gate",
			curtain_element:		args.curtain_element || ".curtain",
			page_element: 			args.page_element || ".wrapper",
			domain:					args.domain || "",
			base_url:				args.base_url || "",
			cookie_expiry_days: 	args.cookie_expiry_days || 30,
			use_textboxes: 			args.use_textboxes || false,
			use_local_storage: 		args.use_local_storage || false,
			invalid_country_error: 	args.invalid_country_error || "Sorry, access from this country is not permitted. For more information about Guinness visit <a href='http://www.guinness.com/' target='_blank'>guinness.com/</a>",
			invalid_province_error: args.invalid_province_error || "Please select a province to continue.",
			dob_error: 				args.dob_error || "You must be at least %age% to enter this site.",
			redirect: 				args.redirect || false,
			redirect_http: 			args.redirect_http || true,
			redirect_target: 		args.redirect_target || "http://drinkaware.co.uk",
			redirect_time_limit: 	args.redirect_time_limit || 10,
			callback: 				args.callback || function () {},
			default_country:		args.default_country || "CA-EN",
			default_province:		args.default_province || "0",
			default_language:		args.default_language || "en",
			default_day:			args.default_day || new Date().getDate(),
			default_month:			args.default_month || new Date().getMonth(),
			default_year:			args.default_year || new Date().getFullYear(),
			bypass:					args.bypass || false
		};
		

		//initialise the age-gate, passing in the options
		function init(options) {
			//break out of frames
			if (top.location !== location) top.location.href = document.location.href;

			//Show a loading animation while the gateway is being loaded in
			$(".age-gate").append("<div class='loader'></div>");

			//Setup default values
			var defaults = {
				day: options.default_day,
				month: options.default_month,
				year: options.default_year,
				regExp: /^[0-9]*$/,
				cookies_enabled: cookiesEnabled()
			};

			//Setup the cookie
			var cookie_data = {
				pass: options.bypass,
				country: '',
				province: '',
				language: '',
				day: defaults.day,
				month: defaults.month,
				year: defaults.year
			};

			//Test if the browser supports cookies or local storage.
			//Cookies or local storage are required for the age-gate to work.
			//Local storage will only work if the option is enabled
			var enabled = function () {
				if (defaults.cookies_enabled) {
					return true;
				} else {
					if (options.use_local_storage && (true)) {
						return true;
					} else {
						return false;
					}
				}
			};

			//DOM manipulation can only occur once everything has been loaded by the browser
			$(document).ready(function () {

				//create an object to contain the age gate
				var age_gate = $("<div></div>");

				//If both cookies and local storage are disabled, show an error and prevent access to the site
				if (!enabled()) {
					//load 'no cookies' error message
					age_gate.load('age-gate/no-cookies.html', function () {
						//hide the loading animation
						$(".age-gate .loader").hide().remove();
						//append the error message to the gateway
						$(options.age_gate_element).append(age_gate);
					});

				} else {

					//check for and read the stored cookie or 
					//local storage item the data can then be
					//accessed like this:
					/*
					 * passtoken.country
					 * passtoken.language
					 * passtoken.day
					 * passtoken.month
					 * passtoken.year
					 */
					var passtoken = getCookie('diageo-age-gate');
					if (options.use_local_storage && !passtoken) passtoken = JSON.parse(localStorage.getItem('diageo-age-gate'));
					
					//if the user has passed the age-gate before or if bypass has been set
					
					
					if ((passtoken && passtoken.pass===true) || options.bypass===true) {

					$(options.age_gate_element).fadeOut("fast", function() {
												$(options.page_element).fadeIn();
												$(options.curtain_element).fadeOut("fast",function(){$(options.curtain_element).remove();});
												$(this).remove();
												//for IE users, we use an event listener to resize the curtain
												//this should be removed to save memory
												$(window).unbind("resize.agegateway");
												//call the callback function
												options.callback();
												//finally clear all these functions and variables from memory
												win.agegate = "";
																	
											});
	
	

					} else { //if the user has NOT passed the gateway before and no bypass is set

						//load in the age gate form
						age_gate.load(options.base_url + 'age-gate/age-gate.php', function(response, status, xhr) {


							//hide the loading animation
							$(".age-gate .loader").hide().remove();
							//append the form to the age gate object
							$(options.age_gate_element).append(this);

							//show another loading animation for loading in the input elements
							$(".dob-inputs").append("<div class='loader'></div>");

							//load in the input fields (select dropdowns or text inputs)
							if (options.use_textboxes) {
								$(".dob-inputs").load(options.base_url + "age-gate/dob-inputs-text.html", function() {
									//hide the loading animation
									$(".age-gate .loader").hide().remove();
									$(this).addClass("textboxes");
									runGateway();
								});
							} else {
								$(".dob-inputs").load(options.base_url + "age-gate/dob-inputs-select.html", function() {
									//hide the loading animation
									$(".age-gate .loader").hide().remove();
									$(this).addClass("selects");
									runGateway();
								});
							}

							//This function performs all the input validation and collection
							function runGateway() {

								//Cache the input elements
								var inputs = {
									country: $(".age-gate .country"),
									province: $(".age-gate .province"),
									language: $(".age-gate .language"),
									day: $(".age-gate .day"),
									month: $(".age-gate .month"),
									year: $(".age-gate .year"),
									rememberme: $(".age-gate .remember-me-checkbox"),
									submit: $(".age-gate .submit")
								};
	
								//select default options
								inputs.country.find("option[value="+options.default_country+"]").attr("selected","selected");
								inputs.province.find("option[value="+options.default_province+"]").attr("selected","selected");
								inputs.language.find("option[value="+options.default_language+"]").attr("selected","selected");
								
								if(options.use_textboxes) {

									//enter default values
									inputs.day.val(defaults.day);
									inputs.month.val(defaults.month+1);
									inputs.year.val(defaults.year);

									//Event listeners on the text input fields for validation purposes
									inputs.day.blur(function() {
										var el = $(this);
										//only numbers allowed
										if(!defaults.regExp.test(el.val())) el.val(defaults.day);
										var maxdays = getMaxDays(new Number(inputs.month.val())+0, isLeapYear(inputs.year.val()));
										//day cannot exceed the maximum days for the month entered
										if(el.val()>maxdays) el.val(maxdays);
										//day can't be less than 1
										if(el.val()<1) el.val(1);
									});
									inputs.month.blur(function() {
										var el = $(this);
										//only numbers allowed
										if(!defaults.regExp.test(el.val())) el.val(defaults.month);
										var maxdays = getMaxDays(new Number(el.val())+0, isLeapYear(inputs.year.val()));
										//if month is changed, make sure day value doesn't exceed maximum days for the month entered
										if(inputs.day.val()>maxdays) inputs.day.val(maxdays);
										//month cannot exceed 12
										if(el.val()>12) el.val(12);
										//month can't be less than 1
										if(el.val()<1) el.val(1);
									});
									inputs.year.blur(function() {
										var el = $(this);
										//only numbers allowed
										if(!defaults.regExp.test(el.val())) el.val(defaults.year);
										//year cannot be less than 1900
										if(el.val()<1900) el.val(defaults.year);
										//year cannot be later than current year
										if(el.val()>defaults.year) el.val(defaults.year);
									});
								} else {
									//Event listeners on the select input fields for validation purposes
									inputs.month.change(function() {
										//If you change the month, maybe the number of days in the days select dropdown should change
										//e.g. 30 days in September, 31 in October
										setDays(inputs.day, getMaxDays(new Number(this.value)+1, isLeapYear(inputs.year.val())));
									});
									inputs.year.change(function() {
										//If you change the year, the number of days in the days select dropdown may change
										//e.g. February in leap years
										setDays(inputs.day, getMaxDays(new Number(inputs.month.val())+1, isLeapYear(inputs.year.val())));
									});
								}

								//populate form with default values from previous cookie or local storage
								if(passtoken) populateForm(passtoken, inputs);

								//hide error messages when input fields are given focus
								inputs.day.focus(function(){
									$(".dob-error").hide().remove();
								});
								inputs.month.focus(function(){
									$(".dob-error").hide().remove();
								});
								inputs.year.focus(function(){
									$(".dob-error").hide().remove();
								});
								inputs.country.focus(function(){
									$(".country-error").hide().remove();
								});
								inputs.province.focus(function(){
									$(".province-error").hide().remove();
								});
								//when the user submits the gateway form
								inputs.submit.click(function(e) {
								
									//prevent the form from submitting
									e.preventDefault();
									//hide all error messages for the time being
									$(".error").hide().remove();
	
									//cache all input values
									var values = {
										day: inputs.day.val(),
										month: inputs.month.val(),
										year: inputs.year.val(),
										country: 'CA-EN',
										province: inputs.province.val(),
										language: inputs.language.val(),
										rememberme: inputs.rememberme.is(":checked")
									};

								
									//if the country is permitted
									if(validateCountry(values.country) && (values.country=="CA-EN" || values.country=="CA-FR") && (values.province!="0")){
										//if the DOB meets LDA
										if(validateDOB(values.day, values.month, values.year, values.province, options.use_textboxes)) {
													//update cookie data
											cookie_data.pass = true;
											cookie_data.day = values.day;
											cookie_data.month = values.month;
											cookie_data.year = values.year;
											cookie_data.country = values.country;
											cookie_data.province = values.province;
											cookie_data.language = values.language;
	
											//if the user checks the 'remember me' checkbox, the cookie will persist
											//for a number of days (according to the options) otherwise it will expire
											//with the browser session
										
											if(values.rememberme == true) {
												setCookie('diageo-age-gate', cookie_data, options.domain, options.cookie_expiry_days);
											} else {
												setCookie('diageo-age-gate', cookie_data, options.domain);
											}
											if(options.use_local_storage) localStorage.setItem('diageo-age-gate', JSON.stringify(cookie_data));
	
											//hide the gateway
											$(options.age_gate_element).fadeOut("fast", function() {
												$(options.page_element).fadeIn();
												$(options.curtain_element).fadeOut("fast",function(){$(options.curtain_element).remove();});
												$(this).remove();
												//for IE users, we use an event listener to resize the curtain
												//this should be removed to save memory
												$(window).unbind("resize.agegateway");
												//call the callback function
												options.callback();
												//finally clear all these functions and variables from memory
												win.agegate = "";
																								
												//ageGateCompleted();
											});
	

	
										} else {

											//show DOB error
											$(".year-div").append("<div class='error dob-error'>"+options.dob_error.replace("%age%",getLegalAge(inputs.province.val()))+"</div>");
											($(".dob-error")).css("top");
											$(".dob-error").toggleClass("active");

											//if the option is set to redirect the user if they fail DOB validation
											if(options.redirect) {
												var redirect_timer = options.redirect_time_limit;
												//start a countdown
												var redirectInterval = setInterval(function() {
													redirect_timer--
													if(redirect_timer===0){
														//redirect depending on type, HTTP or Link
														if(options.redirect_http===true) window.location.replace(options.redirect_target);
														else window.location.href = options.redirect_target;
														clearInterval(redirectInterval);
													}
												}, 1000);
											}



										}//DOB validation






									} else {
										

										if(!(values.country=="CA-EN" || values.country=="CA-FR")) {
											//show country error
											$(".country-div").append("<div class='error country-error'>"+options.invalid_country_error+"</div>");
											($(".country-error")).css("top");
											$(".country-error").toggleClass("active");	
												
										}else if((values.province=="0")){
											$(".province-div").append("<div class='error province-error'>"+options.invalid_province_error+"</div>");
											($(".province-error")).css("top");
											$(".province-error").toggleClass("active");	
																						
										}

									}//country validation


									
								});//submit gateway



							}//runGateway();

						});//load age gate form
						
					}//if gateway not previously passed

				}//if cookies are enabled

			});//document.ready

		}//init()

		//call the gateway
		init(options);

		/*
		 *	Function: cookiesEnabled()
		 *	
		 *	This function tests whether cookies are enabled by
		 *	setting a test cookie and trying to red it. It
		 *	accepts no arguments and returns a boolean value.
		 *
		 *	returns: Boolean
		 */

		function cookiesEnabled() {
			var cookieEnabled = (navigator.cookieEnabled) ? true : false;
	
			if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
				document.cookie="testcookie";
				cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
			}
	
			if(!cookieEnabled) {
				document.cookie = 'testcookie';
				cookieEnabled = (document.cookie.substring(document.cookie.length-10,document.cookie.length)=='testcookie');
			}
			return (cookieEnabled);
		}//cookiesEnabled

		/*
		 *	Function: setCookie(name: string, value: string, domain: string, days: integer)
		 *
		 *	This function sets a cookie based on the arguments
		 *	received. It needs:
		 *
		 *	namw: 	cookie name (mandatory)
		 *	value: 	the data to be stored inside the cookie (string) (mandatory)
		 *  domain: the domain that the cookie should be restricted to (for security reasons) (mandatory)
		 *	expiry: how many days until the cookie expires. If no value is provided this cookie will expire with the browser session (optional)
		 *
		 *	returns: null
		 */

		function setCookie(name,value,domain,days) {
			$.cookie(name, value, { expires: days, path: '/' });
	
			/*value=value.replace(/"/g,"'");
			if (days) {
				var today = new Date();
				today.setTime(today.getTime()+(days*24*60*60*1000));
				var expires = ";expires="+today.toGMTString();
					
			console.log(expires);
			}
		
			else var expires = "";
			document.cookie = name+"="+value+expires+"; domain="+domain+"; path=/";
			console.log(document.cookie);
			*/
		}//setCookie

		/*
		 *	Function: readCookie(name: string)
		 *
		 *	This function reads a cookie and returns a JSON object. It takes
		 *	the name of the cookie as an argument.
		 *
		 *	returns: JSON object representing cookie data
		 */

		function getCookie(name) {
			return $.cookie(name);

/*
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) {
					var tmp = c.substring(nameEQ.length,c.length);
					tmp=tmp.replace(/'/g,'"');
					return jQuery.parseJSON(tmp);
				}
			}
			*/
			//return null;
		}//getCookie

		/*
		 *	Function: isLeapYear(y:integer)
		 *
		 *	This function checks if a year is a leap year.
		 *
		 *	returns: Boolean
		 */

		function isLeapYear(y) {
			var Result = false;
			if ( (y % 4) == 0) {
				if ( (y % 100) == 0) {
					Result = ( (y % 400) == 0);
				} else {
					Result = true;
				}
			} else {
				Result = false;
			}	
			return (Result);
		}//isLeapYear

		/*
		 *	Function: isLeapYear(m:integer, ly:boolean)
		 *
		 *	This function calculates the maximum number of days
		 *	in a given month. It needs:
		 *
		 *	m: 	month (integer) (mandatory)
		 *	ly: leap year (boolean) (mandatory)
		 *
		 *	returns: Integer
		 */

		function getMaxDays(m, ly) {
			var last_day = 31;
			switch(m) {
				case 2:
					if(ly)	last_day = 29;
					else	last_day = 28;
					break;
				case 4:
				case 6:
				case 9:
				case 11:
					last_day = 30;
					break;
				default:
					last_day = 31;
			}
			return last_day;
		}//getMaxDays

		/*
		 *	Function: setDays(d:object, v:integer)
		 *
		 *	This function updates the days dropdown list options.
		 *
		 *	d: 	day list object (mandatory)
		 *	v: 	maximum number of days (integer) (mandatory)
		 *
		 *	returns: null
		 */

		function setDays(d,v) {
			var currentDays = d.find("option").length;
			if(currentDays>v) {
				for(var i=currentDays;i>v;i--) {
					d.append("<span></span>");
					if(d.find("option[value="+(i)+"]").attr("selected") == "selected") d.find("option[value="+(i-1)+"]").attr("selected","selected");
					d.find("option[value="+i+"]").remove();
				}
			} else {
				for(var i=currentDays+1;i<=v;i++) {
					d.append("<span></span>");
					d.append("<option value='"+i+"'>"+i+"</option>");
				}
			}
			d.css({width:"100% !important"});
		}//setDays

		/*
		 *	Function: populateForm(cookie:oject, inputs:object)
		 *
		 *	This function populates the form based on values provided.
		 *
		 *	cookie: 	The values to use (JSON object) (mandatory)
		 *	inputs: 	The collection of input elements (JSON object) (mandatory)
		 *
		 *	returns: null
		 */

		function populateForm(cookie, inputs) {
			inputs.country.find("option[value="+cookie.country+"]").attr("selected","selected");
			inputs.province.find("option[value="+cookie.province+"]").attr("selected","selected");			
			inputs.language.find("option[value="+cookie.language+"]").attr("selected","selected");
			if(options.use_textboxes) {
				inputs.day.val(cookie.day);
				inputs.month.val(cookie.month);
				inputs.year.val(cookie.year);
			} else {
				inputs.day.find("option[value="+cookie.day+"]").attr("selected","selected");
				inputs.month.find("option[value="+cookie.month+"]").attr("selected","selected");
				inputs.year.find("option[value="+cookie.year+"]").attr("selected","selected");
			}
			
		}//populateForm

		/*
		 *	Function: validateCountry(c:string)
		 *
		 *	This function checks whether the country is permitted.
		 *
		 *	c: 	the country (string) (mandatory)
		 *
		 *	returns: Boolean
		 */

		function validateCountry(c) {
			if(getLegalAge(c)>0) return true;
			else return false;
		}//validateCountry

		/*
		 *	Function: validateDOB(d:integer, m:integer, y:integer, c:string, utb:boolean)
		 *
		 *	This function checks if the Date of Birth supplied is above
		 *	legal drinking age.
		 *
		 *	d: 	day (integer) (mandatory)
		 * 	m: 	month (integer) (mandatory)
		 *	y: 	year (integer) (mandatory)
		 * 	c: 	country (string) (mandatory)
		 *	utb:whether to use text boxes (boolean) (mandatory)
		 *
		 *	returns: Boolean
		 */

		function validateDOB(d,m,y,c,utb) {
			if(utb) m--;
			var valid = false;
			var dob = new Date(y, m, d);
			var today = new Date();
			if(utb) var lda = new Date(today.getFullYear()-getLegalAge(c),today.getMonth(),today.getDate());
			else var lda = today.setFullYear(today.getFullYear()-getLegalAge(c));
			if(dob <= lda) {
				valid = true;
			} else {
				valid = false;
			}
			return valid;
		}//validateDOB

		/*
		 *	Function: getLegalAge(c:string)
		 *
		 *	This function returns the legal drinking age for the country supplied.
		 *
		 *	c: 	the country (string) (mandatory)
		 *
		 *	returns: Integer
		 */

		function getLegalAge(c) {
			var requiredAge = 19;
			switch (c) {  
				case "0":
					requiredAge = -1;
					break;
				case "AB":  
					requiredAge = 18;
					break;
				case "BC":  
					requiredAge = 19;
					break;
				case "MB":
					requiredAge = 18;
					break;
				case "NB":  
					requiredAge = 19;
					break;
				case "NL":  
					requiredAge = 19;
					break;
				case "NT":  
					requiredAge = 19;
					break;
				case "NS":  
					requiredAge = 19;
					break;
				case "NU":  
					requiredAge = 19;
					break;
				case "ON":  
					requiredAge = 19;
					break;
				case "PE":  
					requiredAge = 19;
					break;
				case "SK":  
					requiredAge = 19;
					break;
				case "YT":  
					requiredAge = 19;
					break;
			}
			return requiredAge;
		}//getLegalAge
		

	};
})(this);