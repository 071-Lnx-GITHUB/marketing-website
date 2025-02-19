/*

  This is a JavaScript bookmarklet that fills in forms with dummy data for you.

  Written by KRUSH.

  To use it:

  1. Minify all the JavaScript onto one line using http://jscompress.com/
      - Note that the one line of JavaScript must start with "javascript:"
  2. Bookmark any page in you browser
  3. Edit the bookmar and set the URL to the one line of minified javascript
  4. When on an Optimizely page click the bookmark and boom!

*/
javascript: (function(window, document, $) {
    var firstName,
        lastName,
        role,
        phone,
        email,
        date,
        timestamp,
        website,
        title,
        company,
        pword;
    firstName = 'Bradley';
    lastName = 'Heinz test';
    phone = '6309998082';
    pword = 'ks93+-93KLI';
    role = 'software engineer';
    date = new Date();
    timestamp = date.getFullYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
    email = firstName + '+test' + timestamp + '@optimizely.com';
    website = 'bradleyheinz.com';
    title = 'Marketing engineer';
    company = "Optimizely";
    numOfCustomers = "5,000-9,999";
    partnerReason = "building out a world-class optimization organization";
    partnerBuyer = "Marketing";
    address = "631 Howard St., Suite 100";
    city = "San Francisco";
    state = "CA";
    zip = "94105";
    country = "USA";
    existingClients = "CNN, Doctors Without Borders, Hillary Clinton";
    //populate name fields
    $('[name="first_name"]').val(firstName);
    $('[name="role"]').val(role);
    $('[name="last_name"]').val(lastName);
    $('[name="Tech_Partner_goal_for_partnership__c"]').val(partnerReason);
    $('[name="name"]').val(firstName + ' ' + lastName);
    $('[name="Travel_target__c"]').prop('checked',true);
    $('[name="Tech_Partner_Want_to_Build_Integration"]').filter('[value=yes]').prop('checked',true);
    $('[name="Tech_Partner_Primary_Buyer__c"]').val(partnerBuyer);
    //populate company fields
    $('[name="company_name"]').val(company);
    $('[name="company"]').val(company);
    //populate title fields
    $('[name="title"]').val(title);
    //populate email fields
    $('[name="email_address"]').val(email);
    $('#Tech_Partner_Number_of_Customers__c').val(numOfCustomers);
    $('[name="email"]').val(email);
    $('[name="address"]').val(address);
    $('[name="city"]').val(city);
    $('[name="state"]').val(state);
    $('[name="zip"]').val(zip);
    $('[name="country"]').val(country);
    $('[name="Existing_customers_using_Optimizely__c"]').val(existingClients);
    $('[name="has_immediate_project__c"]').filter('[value=yes]').prop('checked', true);



    //populate phone fields
    $('[name="phone_number"]').val(phone);
    //populate website/url fields
    $('[name="website"]').val(website);
    $('[name="url-input"]').val(website);
    //populate pword fields
    $('[name="password"]').val(pword);
    $('[name="password1"]').val(pword);
    $('[name="password2"]').val(pword);
})(window, document, jQuery);
