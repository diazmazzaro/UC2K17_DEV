#include <SoftwareSerial.h>
#include <TinyGPS++.h>

TinyGPSPlus gps;
#define PIN_GPS_TX      11            //GPS TX
#define PIN_GPS_RX      12            //GPS RX
static const uint32_t GPSBaud = 9600; //GPS Baudrate
SoftwareSerial ss(PIN_GPS_RX, PIN_GPS_TX);

#define PIN_IO_TX      6              //IO TX
#define PIN_IO_RX      7              //IO RX
static const uint32_t IOBaud = 9600;  //IO Baudrate
SoftwareSerial io_serial(PIN_IO_RX, PIN_IO_TX);

#define PIN_LED_BLUE   2             //GPS TX
#define PIN_LED_GREEN  4
unsigned long led_g_count = 0;
void setup() {
  pinMode(PIN_LED_BLUE, OUTPUT);
  pinMode(PIN_LED_GREEN, OUTPUT);
  // put your setup code here, to run once:
  Serial.begin(GPSBaud);
  ss.begin(GPSBaud);
  //io_serial.begin(4800);
  pinMode(LED_BUILTIN, OUTPUT);
  led_g_count = millis();
}

static void smartDelay(unsigned long ms)                // This custom version of delay() ensures that the gps object is being "fed".
{
  //ss.listen();
  unsigned long start = millis();
  
  do 
  {
    while (ss.available())
      gps.encode(ss.read());      
  } while (millis() - start < ms);
}

static void printFloat(float val, bool valid, int len, int prec)
{
  if (!valid)
  {
    while (len-- > 1)
      Serial.print('*');
    Serial.print(' ');
  }
  else
  {
    Serial.print(val, prec);
    int vi = abs((int)val);
    int flen = prec + (val < 0.0 ? 2 : 1); // . and -
    flen += vi >= 1000 ? 4 : vi >= 100 ? 3 : vi >= 10 ? 2 : 1;
    for (int i=flen; i<len; ++i)
      Serial.print(' ');
  }
  smartDelay(0);
}


void _responseNO(Stream &serial){ 
  serial.println("{\"gps\":none}");
}

String _responseNoGPS(){  
  String message = "{\"lat\":";
  message += "-58.3728";
  smartDelay(0);
  message += ",\"lon\":";
  message += "-34.5935";
  smartDelay(0);
  message += ",\"course\":";
  message += "0";
  smartDelay(0);
  message += ",\"speed\":";
  message += "0";
  smartDelay(0);
  message += ",\"sats\":";
  message += "-1";
  message += ",\"SIM\":true";
  message += "}";
  return message;
}

void _responseERROR(Stream &serial){
  serial.println("{\"error\":\"Method not implemented\"}");
}

void _responseBlueLED(Stream &serial){
  digitalWrite(PIN_LED_BLUE, HIGH);
  serial.println("{\"led\":true}");
}
String getGPS(){
  if(gps.location.isValid()){
    String message = "{\"lat\":";
    message += String(gps.location.lat(), 6);
    smartDelay(0);
    message += ",\"lon\":";
    message += String(gps.location.lng(), 6);
    smartDelay(0);
    message += ",\"course\":";
    message += gps.course.deg();
    smartDelay(0);
    message += ",\"speed\":";
    message += gps.speed.kmph();
    smartDelay(0);
    message += ",\"sats\":";
    message += gps.satellites.value();
    message += ",\"SIM\":false";
    message += "}";
    return message;
  }
  else{
    return _responseNoGPS();
  }
}
void _responseGPS(Stream &serial){
  serial.println(getGPS());
}
String getTIME(){
  if(gps.time.isValid()){
    String message = "{\"h\":";
    message += gps.time.hour();
    message += ",\"m\":";
    message += gps.time.minute();
    message += ",\"s\":";
    message += gps.time.second();
    message += ",\"SIM\":false";
    message += "}";
    return message;
  }
  else{
    return _responseNoTIME();
  }
}
String _responseNoTIME(){
  String message = "{\"h\":";
  message += 0;
  message += ",\"m\":";
  message += 0;
  message += ",\"s\":";
  message += 0;
  message += ",\"SIM\":true}";
  return message;
}
void _responseTIME(Stream &serial){
  serial.println(getTIME());
}

void _responseGET(Stream &serial){
  String message = "{\"Pos\":";
  message += getGPS();
  message += ",\"Time\":";
  message += getTIME();
  message += "}";
  serial.println(message);
}


void response(Stream &serial, String method){
  if (method == "GET") {
    _responseGET(serial);
  }
  else if (method == "GPS") {
    _responseGPS(serial);
  }
  else if (method == "LED") {
    _responseBlueLED(serial);
  }
  else if (method == "TIME") {
    _responseTIME(serial);
  }
  else if(method != ""){
    _responseERROR(serial);
  }
}


int led_count = 0;
void request(Stream &serial){
  String req = "";
  while (serial.available()){
    req = req + (char)serial.read();
    led_count = 2;
    led_g_count = 1;
  }
      
  response(serial, req);
}
int _wait = 0;
void loop() {
  request(Serial);
  //io_serial.listen();
  //request(io_serial);
  if(--led_count > 0){
    digitalWrite(LED_BUILTIN, HIGH);
    digitalWrite(PIN_LED_BLUE, HIGH);
  }    
  else if(led_count <= 0){
    digitalWrite(LED_BUILTIN, LOW);
    digitalWrite(PIN_LED_BLUE, LOW); 
  }  

  if(millis() - led_g_count > 500){
    if(_wait > 0){
      digitalWrite(PIN_LED_GREEN, HIGH);  
      _wait = 0;
    }
    else{
      _wait = 1;
      digitalWrite(PIN_LED_GREEN, LOW);
    }
    led_g_count = millis();
  }
  //response(Serial, "GET");
  /*if(gps.location.isValid()){
    Serial.print("{\"gps\":{\"lat\":");
    Serial.print(gps.location.lat(), 6);
    smartDelay(0);
    Serial.print(",\"lon\":");
    Serial.print(gps.location.lng(), 6);
    smartDelay(0);
    Serial.print(",\"course\":");
    Serial.print(gps.course.deg(), 2);
    smartDelay(0);
    Serial.print(",\"speed\":");
    Serial.print(gps.speed.kmph(), 2);
    smartDelay(0);
    Serial.print(",\"sats\":");
    Serial.print(gps.satellites.value());
    Serial.println("}}");
  }*/
  /*if(gps.time.isValid()){
    Serial.print("{\"time\":{\"h\":");
    Serial.print(gps.time.hour());
    Serial.print(",\"m\":");
    Serial.print(gps.time.minute());
    Serial.print(",\"s\":");
    Serial.print(gps.time.second());
    Serial.println("}}");
  }*/
  smartDelay(500);
}
