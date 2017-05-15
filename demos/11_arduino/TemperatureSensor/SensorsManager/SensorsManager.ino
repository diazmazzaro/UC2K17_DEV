//** WIFI includes *******************************************
#include <ESP8266WiFi.h>          //https://github.com/esp8266/Arduino

//needed for library
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include "WiFiManager.h"         //https://github.com/tzapu/WiFiManager

std::unique_ptr<ESP8266WebServer> server;
//************************************************************
#include <SoftwareSerial.h>
#include <DHT.h>
#include <Adafruit_NeoPixel.h>
//#include <TinyGPS++.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define PIN_RELAY      0
#define PIN            2
#define NUMPIXELS      2
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

#define DHTPIN 14     // what digital pin we're connected to
// Uncomment whatever type you're using!
#define DHTTYPE DHT11     // DHT 11
//#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
//#define DHTTYPE DHT21   // DHT 21 (AM2301)
DHT dht(DHTPIN, DHTTYPE);

//TinyGPSPlus gps;
#define PIN_GPS_TX      13            //GPS TX
#define PIN_GPS_RX      15            //GPS RX
static const uint32_t GPSBaud = 9600; //GPS Baudrate
SoftwareSerial ss(PIN_GPS_RX, PIN_GPS_TX);

#define PIN_W_TX      4             //GPS TX
#define PIN_W_RX      0            //GPS RX

SoftwareSerial weather(PIN_W_RX, PIN_W_TX);


//****************************************************************************
String getGPS(){
  String message = "";
  
  Serial.println("GPS");
  //clean
  while(ss.available())
    ss.read();
  ss.print("GET");
  delay(50);
  
  unsigned long _ini = millis();
  do{
    while(ss.available())
      message += (char)ss.read();  
  }while(millis() - _ini  < 400);
  
  Serial.println(message);
  return message;
}

String getW(){
  String message = "";
  //clean
  while(weather.available())
    weather.read();
  Serial.println("weather");
  weather.print("GET");
  delay(50);
  unsigned long _ini = millis();
  do{
    while(weather.available()){
      message += (char)weather.read();  
    }
    delay(50);
    while(weather.available()){
      message += (char)weather.read();  
    }
  }while(millis() - _ini  < 800);
  
  Serial.println(message);
  return message;
}
//****************************************************************************

void handleRoot() {

  String page = FPSTR(HTTP_HEAD);
  page += FPSTR(HTTP_SCRIPT);
  page += FPSTR(HTTP_STYLE);
  page += FPSTR(HTTP_PDM_STYLE);
  page += FPSTR(HTTP_HEAD_END);
  page += "<div class=\"main\">";
  page += "<div class=\"title\"><h1>";
  page += "Sensor Manager";
  page += "</h1></div>";
  page += "</div>";
  page += FPSTR(HTTP_END);

  server->send(200, "text/html", page);

}

const char HTTP_PIXEL_SCRIPT[] PROGMEM = "<script>var i=document.querySelector('input');var d=document.getElementById('dSample');var l=document.querySelector('.loader');i.addEventListener('change', function(){l.style.display='';d.style.backgroundColor='#'+i.value;var req=new XMLHttpRequest();req.addEventListener('loadend',function(e){l.style.display='none';});req.open('GET','/HEXA?h='+i.value,false);req.send();})</script>";
const char HTTP_PIXEL_STYLE[] PROGMEM = "<style>.picker{background-color:#000000;width:50px;height:50px;border:2px solid black;display:inline-block;margin-bottom:-9px;border-radius:30px;margin-left: 5px;}</style>";
const char HTTP_PIXEL[] PROGMEM = "<div><p>Please select a color to tint your ambient.</p><p>Color:<input class=\"jscolor\" value=\"000000\" style=\"width60px;\"><div id=\"dSample\" class=\"picker\"></div></p></div></div>";
const char HTTP_LOADER_STYLE[] PROGMEM = "<style>.loader{width:100%;padding:0;margin:0;height:100%;position:fixed;top:0px;left:0px;background:rgba(0,0,0,.4);text-align:center;line-height:30;}</style>";
const char HTTP_LOADER[] PROGMEM = "<div class=\"loader\" style=\"display:none;\">Loading...</div>";


void handlePixel() {
  String page = FPSTR(HTTP_HEAD);
  page += FPSTR(HTTP_SCRIPT);
  page += FPSTR(HTTP_STYLE);
  page += FPSTR(HTTP_PDM_STYLE);
  page += FPSTR(HTTP_PIXEL_STYLE);
  page += FPSTR(HTTP_LOADER_STYLE);
  page += FPSTR(HTTP_HEAD_END);
  page += "<div class=\"main\">";
  page += "<div class=\"title\"><h1>";
  page += "LED Color Picker";
  page += "</h1></div>";
  page += FPSTR(HTTP_PIXEL);
  page += FPSTR(HTTP_LOADER);
  page += "</div>";
  page += FPSTR(HTTP_PIXEL_SCRIPT);
  page += FPSTR(HTTP_END);

  server->send(200, "text/html", page);
}

void handleHEXA() {
  uint32_t col;
  String json = "{hex:";
  
  Serial.println("R-HEXA:");
  
  Serial.println(server->args());
  for (uint8_t i=0; i<server->args(); i++){
    if(server->argName(i) == "h"){
      Serial.print("A-h:");
      Serial.println(server->arg(i));
      
      col = strtol(server->arg(i).c_str(), NULL, 16);
      json += col;
    }
  }  
  json += "}";
  
  for(int i=0;i<NUMPIXELS;i++){
    pixels.setPixelColor(i, col);
  }
  pixels.show();

  server->send(200, "application/json", json);
}


void handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server->uri();
  message += "\nMethod: ";
  message += (server->method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server->args();
  message += "\n";
  for (uint8_t i = 0; i < server->args(); i++) {
    message += " " + server->argName(i) + ": " + server->arg(i) + "\n";
  }
  server->send(404, "text/plain", message);
}

void handleGET() {
  String message = "{\"temp\":";
  float t = dht.readTemperature();
  Serial.print("Temperatura:");
  Serial.println(t);
  
  float h = dht.readHumidity();
  float hic = dht.computeHeatIndex(t, h, false);
  message += t;
  message += ",\"hum\":";
  message += h;
  message += ",\"gps\":";
  message += getGPS();
  message += ",\"wea\":";
  message += getW();
  
  message = message + "}";

  server->send(200, "application/json", message);
}
//****************************************************************************
void initTempAndHum(){
  dht.begin();
}
void initPixel(){
#if defined (__AVR_ATtiny85__)
  if (F_CPU == 16000000) clock_prescale_set(clock_div_1);
#endif
  pixels.begin();
  for(int i=0;i<NUMPIXELS;i++){
    pixels.setPixelColor(i, pixels.Color(0,0,0));
  }
  pixels.show();
}
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  //Serial.setDebugOutput(true);
  //WiFiManager
  //Local intialization. Once its business is done, there is no need to keep it around
  WiFiManager wifiManager;
  //reset saved settings
  wifiManager.resetSettings();

  //fetches ssid and pass from eeprom and tries to connect
  //if it does not connect it starts an access point with the specified name
  //here  "AutoConnectAP"
  //and goes into a blocking loop awaiting configuration
  //wifiManager.autoConnect("AutoConnectAP");
  //or use this for auto generated name ESP + ChipID
  wifiManager.autoConnect();


  //if you get here you have connected to the WiFi
  Serial.println("connected...yeey :)");
  
  server.reset(new ESP8266WebServer(WiFi.localIP(), 80));
  
  initPixel();
  initTempAndHum();
  
  server->on("/", handleRoot);
  server->on("/pixel", handlePixel);
  server->on("/PIXEL", handlePixel);

  server->on("/HEXA", handleHEXA);
  server->on("/HEX", handleHEXA);
  server->on("/hex", handleHEXA);

  server->on("/GET", handleGET);
  server->on("/get", handleGET);
  

  server->on("/inline", []() {
    server->send(200, "text/plain", "this works as well");
  });

  server->onNotFound(handleNotFound);

  server->begin();
  Serial.println("HTTP server started");
  Serial.println(WiFi.localIP());
}

void loop() {
  // put your main code here, to run repeatedly:
  server->handleClient();
}
