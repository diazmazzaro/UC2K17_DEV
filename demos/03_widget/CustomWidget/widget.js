define(['dojo/_base/declare', 'jimu/BaseWidget'],
function(declare, BaseWidget) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    // DemoWidget code goes here 
    baseClass: 'jimu-widget-custom',
    postCreate: function() {
      this.inherited(arguments);
      console.log(this.config.someText);
    }
  });
});