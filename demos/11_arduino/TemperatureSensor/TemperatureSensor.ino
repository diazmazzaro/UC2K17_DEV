#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <DHT.h>
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define PIN_RELAY      0
#define PIN            2
#define NUMPIXELS      2
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);


#define DHTPIN 14     // what digital pin we're connected to

// Uncomment whatever type you're using!
#define DHTTYPE DHT11   // DHT 11
//#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
//#define DHTTYPE DHT21   // DHT 21 (AM2301)
DHT dht(DHTPIN, DHTTYPE);


#define HOSTNAME     "ASA-TEMP-001"
const char *ssidAP = "UC2k17-TEMP";
const char *passwordAP = "pdm123asa";

const char* ssid = "wawawan2";
const char* password = "pabloandres";

ESP8266WebServer server(80);

const int led = 13;
String html = "";

String htmlHead = "<!DOCTYPE html>"
"<html>"
"<head>"
"  <title>Sensor de Temperatura</title>"
"  <style type=\"text/css\">"
"    b[val^=\"-9\"],b[val^=\"-8\"]{"
"      color: #22ff00;"
"    }"
"    b[val^=\"-7\"]{"
"      color: #ffff00;"
"    }"
"    b[val^=\"-6\"],b[val^=\"-5\"],b[val^=\"-4\"],b[val^=\"-3\"],b[val^=\"-2\"]{"
"      color: #ff0000;"
"    }"
"  </style>"
"</head>"
"<body style=\"text-align:center;\">"
" <script>"
" function setTextColor(picker) {"
"   document.getElementsByTagName('body')[0].style.color = '#' + picker.toString()"
" }"
" </script> "
" <div style=\"width:350px;margin-left:auto;margin-right:auto;font-family: monospace;color: white;background-color:#00BCD4;border-radius:5px;border: 1px solid #3F51B5;\">"
"   <div style=\"font-size:25px;border-radius:5px 5px 0 0;border:0;border-bottom: 1px solid #3F51B5;background-color: #2196F3;\">"
"     AmbiPIXEL"
"   </div>";

String htmlFoot = "</body>"
"</html>";

String htmlSelector =  "   <div >"
"     <p>Please select a color to tint your ambient.</p>"
"     <p>Color: <input class=\"jscolor\" value=\"000000\" style=\"width:50px;\">"
"     <div id=\"dSample\" style=\"background-color:#000000;width: 50px;height: 50px;border:2px solid black;display: inline-block;margin-bottom: -9px;border-radius: 30px;margin-left: 5px;\"></div></p>"
"     <a href=\"/SCAN\">network</a>"
"   </div>"
" </div>"
" <script>"
" var input = document.querySelector('input');"
" var dSample = document.getElementById('dSample');"
" input.addEventListener('change', function(){"
"   console.log('input changed to: ', input.value);"
"   dSample.style.backgroundColor = '#' + input.value;"
"   try{"
"     var xmlHttp = new XMLHttpRequest();"
"     xmlHttp.open( \"GET\", \"/HEXA?h=\" + input.value, false ); "
"     xmlHttp.send( null );"
"   }catch(er){"
"     console.log(er);"
"   }"
" });"
" </script>";

void handleRoot() {
  digitalWrite(led, 1);
  html = htmlHead;
  html += "   <div > Last NETWORK Joined:<b>";
  html += WiFi.SSID();
  html += "</b> IP:<b>";
  html += ipToString(WiFi.localIP());
  html += "</b></div>";
  html += htmlSelector;
  html += htmlFoot;
  server.send(200, "text/html", html);
  digitalWrite(led, 0);
}

void handleOFF() {
  String message = "{result:true}";
  for(int i=0;i<NUMPIXELS;i++){
    pixels.setPixelColor(i, pixels.Color(0,0,0));
    pixels.show();
    delay(2);
  }
  server.send(200, "text/plain", message);
}
void handleCONFIG() {
  String message = "{result:true;conn:";
  Serial.println(server.args());
  int ix = -1;
  String pass = "";
  for (uint8_t i=0; i<server.args(); i++){
    message += server.argName(i) + ": " + server.arg(i) + "";
    if(server.argName(i) == "i"){
      ix = server.arg(i).toInt();
    }
    if(server.argName(i) == "p"){
      pass = server.arg(i);
    }

  }
  
  message += "};}";
  Serial.print("-ssid:");  
  Serial.print(WiFi.SSID(ix));
  Serial.println("-pass:");
  Serial.print(pass);

  WiFi.hostname("your name");

  WiFi.begin(WiFi.SSID(ix).c_str(), pass.c_str());
  //WiFi.setAutoConnect(true);
  //WiFi.reconnect();
  int i = 0;
  while (WiFi.status() != WL_CONNECTED && i++ < 25) {
    delay(500);
    Serial.print(".");
  }
   message = "ERROR";
  if(WiFi.status() == WL_CONNECTED){
    Serial.println("");
    Serial.print("Connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    message = ""+ WiFi.localIP();
  }
  else{
    Serial.println("error");
  }  
  message = "{ip:'" +  message;
  message +="'}";
  server.send(200, "text/plain", message);
}
void handleSCAN(){
  html = htmlHead;
  
  html += "   <div >"
"     <p>Please select WiFi provider</p>"
"     <ul style=\"margin-left:5px;margin-right:0; text-align:left;\">";


  int n = WiFi.scanNetworks();
  if (n > 0)
  {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i)
    {
      // Print SSID and RSSI for each network found
      html += "<li><input type=\"radio\" name=\"wifi\" value=\"";
      html += i;
      if(WiFi.encryptionType(i) == ENC_TYPE_NONE)
        html += "\" open=\"true\">" ;
      else
        html += "\">" ;
      html += WiFi.SSID(i);
      html += "<b val=\"";
      html += WiFi.RSSI(i);
      html += "\">(" ;
      html += WiFi.RSSI(i);
      html += ")</b>" ;
      if(WiFi.encryptionType(i) == ENC_TYPE_NONE)
        html += "&nbsp;[OPEN]";
      
      html += "</input></li>";
      /*Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.print(")");
      Serial.println((WiFi.encryptionType(i) == ENC_TYPE_NONE)?" ":"*");*/
      delay(10);
    }
  }
  
  html += "     </ul>"
"   </div>"
"<div>Password:<input type=\"text\" id=\"pass\"/> <div>"
    "<div>"
      "<input type=\"button\" onClick=\"connectWifi()\" value=\"Connect\"></input>"
    "</div>"
" </div>";

  html += "<script>"
"    connectWifi = function(){"
"    var url = '/CONFIG?i=';"
"    var obj = null;"
"    for(var i in document.getElementsByName('wifi')){"
"    if(document.getElementsByName('wifi')[i].checked){"
"      obj = document.getElementsByName('wifi')[i].value;"
"      break;"
"    }"
"    }"
"    if(obj){"
"    url += obj + '&p=' + document.getElementById('pass').value;"
"    console.log(url);"
"    try{"
"      var xmlHttp = new XMLHttpRequest();"
"      xmlHttp.open( 'GET', url, false );"
"      xmlHttp.send( null );"
"    }catch(er){"
"      console.log(er);"
"    }"
"    }"
"  };"
  "</script>";
  
  html += htmlFoot;
  
  server.send(200, "text/html", html);
}
void handleON(){
  String message = "{result:'ok'}";
  digitalWrite(PIN_RELAY, 1);
  server.send(200, "text/plain", message);
  
}

String ipToString(IPAddress ip){
  String s="";
  for (int i=0; i<4; i++)
    s += i  ? "." + String(ip[i]) : String(ip[i]);
  return s;
}

void handleIP(){
  String message = "{result:'ok', IP:'";
  message += ipToString(WiFi.localIP());
  message += "'}";
  server.send(200, "text/plain", message);
  
}

void handleTEM() {
  String message = "{'lat':-39.456;'lon':-33.00992;'temp':";
  float t = dht.readTemperature();

  Serial.print("Temperatura:");
  Serial.println(t);
  
  float h = dht.readHumidity();
  float hic = dht.computeHeatIndex(t, h, false);
  message = message + t;
  message = message + "}";
  server.send(200, "text/plain", message);
}

void handleLED() {
  digitalWrite(led, 1);
  int r=0;
  int g=0;
  int b=0;
  String message = "{result:true;rgb:";
  String tmp = "";
  Serial.println("-----------------------------------------");
  
  Serial.println(server.args());
  for (uint8_t i=0; i<server.args(); i++){
    message += server.argName(i) + ": " + server.arg(i) + "";
    
    if(server.argName(i) == "r"){
      tmp = server.arg(i);
      r = tmp.toInt();
    }
    if(server.argName(i) == "g"){
      tmp = server.arg(i);
      g = tmp.toInt();
    }
    if(server.argName(i) == "b"){
      tmp = server.arg(i);
      b = tmp.toInt();
    }
    Serial.println(tmp);
    Serial.print("Int:");
    Serial.println(tmp.toInt());
  }
  message += "};}";
  Serial.print("r:");
  Serial.println(r);
  Serial.print("g:");
  Serial.println(g);
  Serial.print("b:");
  Serial.println(b);
  
  for(int i=0;i<NUMPIXELS;i++){
    pixels.setPixelColor(i, pixels.Color(r,g,b));
    pixels.show();
    delay(250);
  }
  if(r== 0 && g==0 && b==0)
    digitalWrite(PIN_RELAY, LOW);
  else
    digitalWrite(PIN_RELAY, HIGH);
  server.send(200, "text/plain", message);
  digitalWrite(led, 0);
}

void handleHEXA() {
  digitalWrite(led, 1);
  uint32_t col;
  String message = "{result:true;hex:";
  
  Serial.println("-----------------------------------------");
  
  Serial.println(server.args());
  for (uint8_t i=0; i<server.args(); i++){
    message += server.argName(i) + ": " + server.arg(i) + "";
    if(server.argName(i) == "h"){
      Serial.print("HEX:");
      Serial.println(server.arg(i));
      
      col = strtol(server.arg(i).c_str(), NULL, 16);
    }
  }
  
  message += "};}";
  Serial.print("-hex:");
  Serial.println(col);
  
  for(int i=0;i<NUMPIXELS;i++){
    pixels.setPixelColor(i, col);
    pixels.show();
    delay(250);
  }

  if(col > 0)
    digitalWrite(PIN_RELAY, HIGH);
  else
    digitalWrite(PIN_RELAY, LOW);
  server.send(200, "text/plain", message);
  digitalWrite(led, 0);
}

void handleNotFound(){
  digitalWrite(led, 1);
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET)?"GET":"POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i=0; i<server.args(); i++){
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
  digitalWrite(led, 0);
}

void setup(void){

  Serial.begin(115200);
    // This is for Trinket 5V 16MHz, you can remove these three lines if you are not using a Trinket
#if defined (__AVR_ATtiny85__)
  if (F_CPU == 16000000) clock_prescale_set(clock_div_1);
#endif

  pinMode(PIN_RELAY, OUTPUT);
  digitalWrite(PIN_RELAY, 0);  
  // End of trinket special code
  Serial.println("PIXEL init");
  pixels.begin(); // This initializes the NeoPixel library.
  dht.begin();
  for(int i=0;i<NUMPIXELS;i++){
    pixels.setPixelColor(i, pixels.Color(0,0,0));
    delay(250);
  }
  pixels.show();
  Serial.println("PIXEL OK!");
  pinMode(led, OUTPUT);
  digitalWrite(led, 0);
  
  //WiFi.begin("pap", "pabloandres");
  WiFi.begin();
  Serial.println("");
  Serial.print("Connecting to:");
  Serial.print(WiFi.SSID());
  Serial.println("");
  //WiFi.reconnect();  
  int i = 0;
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED && i++ < 40) {
    delay(500);
    Serial.print(".");
  }

  if(WiFi.status() == WL_CONNECTED){
    Serial.println("");
    Serial.print("Connected to ");
    Serial.println(WiFi.SSID());
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
/*
  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }*/
  }
  else{
//Soft AP-------------------

    switch(WiFi.status()) {
        case WL_CONNECTED:
            Serial.println("Connected");
        case WL_NO_SSID_AVAIL:
            Serial.println("No SSID");
        case WL_IDLE_STATUS:
            Serial.println("IDE");
        default:
            Serial.println("Disconnected");
    }

    Serial.print("Starting SOFT AP");
    //WiFi.softAP(ssidAP, passwordAP); //<--- OPEN for Dev
    
    IPAddress Ip(192, 168, 4, 1);
    IPAddress NMask(255, 255, 255, 0);
    WiFi.softAPConfig(Ip, Ip, NMask);
    WiFi.softAP(ssidAP);
    IPAddress myIP = WiFi.softAPIP();
    Serial.print("AP IP address: ");
    Serial.print(myIP);
//-------------------Soft AP
  }

  server.on("/", handleRoot);
  server.on("/LED", handleLED);
  server.on("/HEXA", handleHEXA);
  server.on("/OFF", handleOFF);
  server.on("/CONFIG", handleCONFIG);
  server.on("/ON", handleON);
  server.on("/IP", handleIP);
  server.on("/TEM", handleTEM);
  

  server.on("/SCAN", handleSCAN);

  server.on("/inline", [](){
    server.send(200, "text/plain", "this works as well");
  });

  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");

}

void loop(void){
  server.handleClient();
}
