conn = new Mongo();
db = conn.getDB("loftusheatingandac");

db.user.insert({
  "email": "mtbosworth@gmail.com",
  "password": "$2a$10$X2HcmRdHLn4MKGFXbLlhbex2ByjaOhaav8x1zLjaelNHoiSeO81Ni",
  "firstname": "Michael",
  "lastname": "Bosworth"
});

db.user.insert({
  "email": "kelly@loftusheatingandac.com",
  "password": "$2b$10$3MDWIsFQ1dfZTEYYuclJNOvxuPR7mnNreZ1sTGwgKaehW5GwLeFsG",
  "firstname": "Kelly",
  "lastname": "Landon"
});

db.user.insert({
  "email": "becky@loftusheatingandac.com",
  "password": "$2a$10$nP5KiZ22XA9hsqUXeCEnWuQuNrgEQKc.b8/5rYu7dBHX1SqN35DAS",
  "firstname": "Becky",
  "lastname": "Loftus"
});

