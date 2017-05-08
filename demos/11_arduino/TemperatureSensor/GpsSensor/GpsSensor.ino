#include <SoftwareSerial.h>
#include <TinyGPS++.h>

TinyGPSPlus gps;
#define PIN_GPS_TX      11             //GPS TX
#define PIN_GPS_RX      12             //GPS RX
static const uint32_t GPSBaud = 9600; //GPS Baudrate
SoftwareSerial ss(PIN_GPS_RX, PIN_GPS_TX);

#define PIN_IO_TX      4              //IO TX
#define PIN_IO_RX      5              //IO RX
SoftwareSerial io_serial(PIN_IO_RX, PIN_IO_TX);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  
  //io_serial.begin(9600);
  delay(100);
  ss.begin(GPSBaud);
  //
  
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.println("<GPS Sensor is ready>");
}

static void smartDelay(unsigned long ms)                // This custom version of delay() ensures that the gps object is being "fed".
{
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

int led_count = 0;
void request(Stream &serial){
  String req = "";
  while (serial.available()){
    //Serial.print((char)Serial.read());
    req = req + (char)serial.read();
    led_count = 2;
  }
  
  if(req != "")
    //Serial.println("REQ:" + req);
  
    
  response(serial, req);
}
void response(Stream &serial, String method){
  if (method == "GET") {
    //Serial.println("get method");
    if(gps.location.isValid()){
      _responseGPS(serial);
    }
    else
      _responseNO(serial);
  }
  else if (method == "TIME") {
    //Serial.println("get time");
    if(gps.time.isValid()){
      _responseTIME(serial);
    }
    else
      _responseNO(serial);
  }
  else if(method != ""){
    _responseNO(serial);
  }
}
void _responseNO(Stream &serial){
  serial.println("{\"gps\":none}");
}

void _responseGPS(Stream &serial){
  serial.print("{\"gps\":{\"lat\":");
  serial.print(gps.location.lat(), 6);
  smartDelay(0);
  serial.print(",\"lon\":");
  serial.print(gps.location.lng(), 6);
  smartDelay(0);
  serial.print(",\"course\":");
  serial.print(gps.course.deg(), 2);
  smartDelay(0);
  serial.print(",\"speed\":");
  serial.print(gps.speed.kmph(), 2);
  smartDelay(0);
  serial.print(",\"sats\":");
  serial.print(gps.satellites.value());
  serial.println("}}");
}

void _responseTIME(Stream &serial){
  serial.print("{\"time\":{\"h\":");
  serial.print(gps.time.hour());
  serial.print(",\"m\":");
  serial.print(gps.time.minute());
  serial.print(",\"s\":");
  serial.print(gps.time.second());
  serial.println("}}");
}

void loop() {
  request(Serial);
  request(io_serial);
  if(--led_count > 0)
    digitalWrite(LED_BUILTIN, HIGH);
  else if(led_count <= 0)
    digitalWrite(LED_BUILTIN, LOW);
  
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