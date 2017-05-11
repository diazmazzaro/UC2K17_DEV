#include <DallasTemperature.h>
#include <OneWire.h>

#include <SoftwareSerial.h>
#include <Wire.h>
#include <Adafruit_BMP085.h>


// Connect VCC of the BMP085 sensor to 3.3V (NOT 5.0V!)
// Connect GND to Ground
// Connect SCL to i2c clock - on '168/'328 Arduino Uno/Nano/Duemilanove/etc thats Analog 5
// Connect SDA to i2c data - on '168/'328 Arduino Uno/Nano/Duemilanove/etc thats Analog 4
// EOC is not used, it signifies an end of conversion
// XCLR is a reset pin, also not used here

Adafruit_BMP085 bmp;

void responseBMP180(Stream &serial){
  String message = "{\"bmpTemp\":";
  message += bmp.readTemperature();
  message += ",\"bmpTempU\":\"C\"";
  message += ",\"bmpAlt\":";
  message += bmp.readAltitude();
  message += ",\"bmpResure\":";
  message += bmp.readPressure();
  message += ",\"bmpSeaResure\":";
  message += bmp.readSealevelPressure();
  message += "}";
  serial.println(message);
}

static const uint32_t IOBaud = 9600;  //IO Baudrate
/*
#define PIN_IO_TX      6              //IO TX
#define PIN_IO_RX      7              //IO RX
SoftwareSerial io_serial(PIN_IO_RX, PIN_IO_TX);
*/
#define PIN_LED_GREEN    6              //IO TX

#define PIN_LED_RED      2
#define PIN_LED_YELLOW   4

#define PIN_US_TRIGGER   10
#define PIN_US_ECHO      9

#define ONE_WIRE_BUS     12
/********************************************************************/
// Setup a oneWire instance to communicate with any OneWire devices  
// (not just Maxim/Dallas temperature ICs) 
OneWire oneWire(ONE_WIRE_BUS); 
/********************************************************************/
// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);
/********************************************************************/  

byte humidity_sensor_pin = A0;
byte humidity_sensor_vcc = 10;

void setup() {
  pinMode(PIN_LED_RED, OUTPUT);
  pinMode(PIN_LED_YELLOW, OUTPUT);
  pinMode(PIN_LED_GREEN, OUTPUT);


  pinMode(PIN_US_TRIGGER, OUTPUT);
  pinMode(PIN_US_ECHO, INPUT);

  pinMode(humidity_sensor_vcc, OUTPUT);
  digitalWrite(humidity_sensor_vcc, LOW);
  // put your setup code here, to run once:
  Serial.begin(IOBaud);  
  //io_serial.begin(IOBaud);
  sensors.begin();
  pinMode(LED_BUILTIN, OUTPUT);
  bmp.begin();

  //Serial.println("<Weather Sensor is ready>");
}
unsigned long _lastHS = 0;
int humidity_sensor = -1;
int _flag = 0;
unsigned long led_r_count = 0;
void read_humidity_sensor() {
  if(_flag == 0){
    _flag = 1;
    _lastHS = millis();
    digitalWrite(humidity_sensor_vcc, HIGH);  
    //led_r_count = millis();
    
  }
  if(millis() - _lastHS > 500){
    int value = analogRead(humidity_sensor_pin);
    digitalWrite(humidity_sensor_vcc, LOW);
    _flag = 0;
    humidity_sensor = 1023 - value;
    
  }
}


unsigned long _lastDistance = 0;
long distance_sensor = -1;
long duration_sensor;
int _flag1 = 0;
unsigned long led_g_count = 0;
void read_distance_sensor() {
  if(_flag1 == 0){
    _flag1 = 1;
    _lastDistance = millis();
    led_g_count = millis();
    digitalWrite(PIN_US_TRIGGER, LOW); 
    delayMicroseconds(2); 
    digitalWrite(PIN_US_TRIGGER, HIGH);
    delayMicroseconds(10); 
    digitalWrite(PIN_US_TRIGGER, LOW);

    duration_sensor = pulseIn(PIN_US_ECHO, HIGH);
    distance_sensor = duration_sensor / 58.2; //Calculate the distance (in cm) based on the speed of sound.
    
  }
  if(millis() - _lastDistance > 200){
    _flag1 = 0;
  }
}


String getBMP180(){
  String message = "{\"bmpTemp\":";
  message += bmp.readTemperature();
  message += ",\"bmpTempU\":\"C\"";
  message += ",\"bmpAlt\":";
  message += bmp.readAltitude();
  message += ",\"bmpResure\":";
  message += bmp.readPressure();
  message += ",\"bmpSeaResure\":";
  message += bmp.readSealevelPressure();
  message += "}";

  return message;
}

void _responseBMP180(Stream &serial){
  serial.println(getBMP180());
}
 

int led_bi_count = 0;

unsigned long led_y_count = 0;
void request(Stream &serial){
  String req = "";
  while (serial.available()){
    req = req + (char)serial.read();
    delay(50);
    led_bi_count = 10;
  }
  /*if(req != "")
    Serial.println(req);*/
  response(serial, req);
}
void response(Stream &serial, String method){
  if (method == "LED") {
    _responseBlueLED(serial, PIN_LED_RED);
  }
  else if (method == "LED2") {
    
    _responseBlueLED(serial, PIN_LED_YELLOW);
  }
  else if (method == "GET") {
    led_y_count = millis();
    _responseGET(serial);
  }
  else if (method == "TEMI") {
    led_y_count = millis();
    _responseTempDS18B20(serial);
  }
  else if (method == "BMP") {
    led_y_count = millis();
    _responseBMP180(serial);
  }
  else if(method != ""){
    _responseERROR(serial);
  }
}
void _responseNO(Stream &serial){
  serial.println("{\"gps\":none}");
}

void _responseERROR(Stream &serial){
  serial.println("{\"error\":\"Method not implemented\"}");
}

void _responseBlueLED(Stream &serial, int led){
  digitalWrite(led, HIGH);
  serial.print("{\"led\":true, \"nro\":");
  serial.print(led);
  serial.println("}");
}

String getTempDS18B20(){
  String message = "{\"temp\":";
  message += (sensors.getTempCByIndex(0));
  message += "}";
  return message;
}

String getHumidity(){
  String message = "{\"hum\":";
  message += (humidity_sensor);
  message += "}";
  return message;
}

String getDistance(){
  String message = "{\"distance\":";
  message += (distance_sensor);
  message += ",\"distanceU\": \"CM\"}";
  return message;
}

void _responseTempDS18B20(Stream &serial){
  sensors.requestTemperatures();
  String message = "{\"DS18B20\":";
  message += getTempDS18B20();
  message += ",\"Humidity\":";
  message += getHumidity();
  message += "}";

  serial.println(message);
}

void _responseGET(Stream &serial){
  sensors.requestTemperatures();
  String message = "{\"DS18B20\":";
  message += getTempDS18B20();
  message += ",\"Humidity\":";
  message += getHumidity();
  message += ",\"BMP\":";
  message += getBMP180();
  message += ",\"Distance\":";
  message += getDistance();
  message += "}";

  serial.println(message);
}

int _wait = 0;
int _wait1 = 1;
void loop() {
  request(Serial);
  
  //io_serial.listen();
  //request(io_serial);
  if(millis() - led_bi_count < 500)
    digitalWrite(LED_BUILTIN, HIGH);
  else
    digitalWrite(LED_BUILTIN, LOW);

  if(millis() - led_y_count < 800)
    digitalWrite(PIN_LED_YELLOW, HIGH);
  else
    digitalWrite(PIN_LED_YELLOW, LOW);


  if(millis() - led_r_count < 800)
    digitalWrite(PIN_LED_RED, HIGH);
  else
    digitalWrite(PIN_LED_RED, LOW);
  /*
  if(++led_r_count < 6)
    digitalWrite(PIN_LED_RED, HIGH);
  else if(++led_r_count < 10)
    digitalWrite(PIN_LED_RED, LOW);
  else{
    //digitalWrite(PIN_LED_RED, LOW);
    led_r_count = 0;
  }
  */
  if(millis() - led_r_count > 500){
    if(_wait > 0){
      digitalWrite(PIN_LED_RED, HIGH);  
      _wait = 0;
    }
    else{
      _wait = 1;
      digitalWrite(PIN_LED_RED, LOW);
    }
    led_r_count = millis();
  }

  if(millis() - led_g_count > 300){
    if(_wait1 > 0){
      digitalWrite(PIN_LED_GREEN, LOW);  
      _wait1 = 0;
    }
    else{
      _wait1 = 1;
      digitalWrite(PIN_LED_GREEN, HIGH);
    }
    led_g_count = millis();
  }
        
  read_humidity_sensor();
  read_distance_sensor();
  


}
