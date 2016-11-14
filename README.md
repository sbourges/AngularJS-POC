#Introduction
There is a lot of hub-hub in the web application industry surrounding this javascript library/framework. More and more job offers asks for it as a skill, so in August 2016 I thought I would have a serious look at it instead of just having an overall view of it as the company I was a consultant for a company that was looking to move their legacy system to AngularJS backed by a .NET or Java RESt WebService.

As pure speculation on my part at this point (might be funny or sound like I was a genius in a few years), I think part of the popularity comes from HTML5 being used to create web application that works for desktop and mobile. Handling everything by hand (i.e. creating your own javascript library in a sense) is a real pain. JQuery is there to help with that. Allowing you to do some nifty stuff removing most of the burden. Comes AngularJS which in a sense pushes JQuery into a framework that is easy to use once understood.

#Setup
For OrderSPA, wwwroot is the web client application and the pure AngularJS front end. You can put that under any webserver flavor of your choice. Just adjust the URL in the [pop.module.js](OderSPA/wwwroot/app/pop.module.js) staticData provider for your environment. The webtest requires [Protractor](https://github.com/angular/protractor). Instruction on how to install on the page.
For POPWS, Controllers and Models for a WebAPI .NET application is provided. So, you just need to create a new WebAPI project. The Test is using Visual Studio standard test framework.

Note that the Web.config was changed to allow cross origin during development since front end and back end are on different port. Other more robust techniques should be used for production (like a reverse proxy).
```xml  
  <system.webServer>
...
   <httpProtocol>
      <customHeaders>
        <add name="Access-Control-Allow-Origin" value="http://localhost:55597" />
        <add name="Access-Control-Allow-Methods" value="GET,PUT,POST,DELETE,OPTIONS" />
        <add name="Access-Control-Allow-Headers" value="Content-Type" />
      </customHeaders>
    </httpProtocol>
...
  </system.webServer>
```

#Walk through
The [Wiki](https://github.com/sbourges/AngularJS-POC/wiki) goes through the demo requirements, design and implementation as well as my impression.
