import express from "express"
import 'dotenv/config'
import mysql from "mysql";

const app = express();
const PORT = process.env.PORT
const HOST = process.env.MYSQL_HOST;
const USER = process.env.MYSQL_USER;
const PASSWORD = process.env.MYSQL_PASSWORD;
const DB = process.env.MYSQL_DB;


// Prepare to connect to MySQL with your secret environment variables
const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DB,
  PORT: 3306
});

// Make the connection
connection.connect(function (err) {
  // Check if there is a connection error
  if (err) {
      console.log("connection error", err.stack);
      return;
  }

  // If there was no error, print this message
  console.log(`connected to database`);
});

app.listen(
  PORT,
  () => console.log("its alive on http://localhost:"+PORT)
)

//9: BPMN registrieren
app.get('/register/:email/:passwordHash', (req, res) => {
     const sql = " SELECT * FROM `users` WHERE email = '"+req.params.email+"';";
              connection.query(sql, function (err, results, fields) {
              if (err) throw err;
              if(results.length === 0) {
                  const sql = " INSERT INTO `users` (`id`, `email`, `passwort`, `created_at`, `updated_at`, `Kontostand`) VALUES (NULL, '"+req.params.email+"', '"+req.params.passwordHash+"', current_timestamp(), current_timestamp(), '0');";
                               connection.query(sql, function (err, results, fields) {
                               if (err) throw err;
                               res.status(200).send(results)
                               //die id des neuen Users ist in insertId gespeichert
                               })
                 } else{
                 res.status(204).send({ message: 'bereits ein User mit dieser Email' })
                 }
              })

});


//12: BPMN Verify Login
//noch nicht richtige funktion
app.get('/Vlogin/:email/:passwordHash', (req, res) => {
    const sql = " SELECT email FROM `users` WHERE email = '"+req.params.email+"';";
          connection.query(sql, function (err, results, fields) {
          if (err) throw err;
          if(results.length === 0) {
             res.status(204).send({ message: 'kein User mit dieser Email' })
          } else {
                const sql = " SELECT email FROM `users` WHERE email = '"+req.params.email+"' AND passwort =" +req.params.passwordHash+";  ";
                connection.query(sql, function (err, results, fields) {
                if (err) throw err;
                if(results.length === 0) {
                   res.status(204).send({ message: 'falsches Passwort' })
                } else {
                    console.log("login erfolg");
                    res.status(200).send({
                    results: results
                    })
                    }
                })
          }
    })
});

//14: BPMN: change Logindata
app.patch('/changeLoginData/:newPwHash/:userID', (req, res) => {
    const sql = "UPDATE `users` SET `Passwort` = `newPwHash` WHERE `users`.`id` = "+userID+";";
                  connection.query(sql, function (err, results, fields) {
                  if (err) throw err;
                  if(results.length === 0) {
                     res.status(204).send({ message: 'error!' })
                     } else {
                     res.status(200).send({
                       message: 'changed Password'
                       })
                     }
                })
});

//16: BPMN: Odds für ein kommendes Spiel
app.get('/odds/:match_id', (req, res) => {
    const sql = "SELECT oddhome,oddsDraw,oddGuest FROM `matchodds` m, `spiel` s JOIN verein v1 ON s.heimverein_id = v1.id JOIN verein v2 ON s.gastverein_id = v2.id where s.id ="+req.params.match_id+" AND v1.altName = m.hometeam_altName AND v2.altName = m.guestteam_altName; ";
          connection.query(sql, function (err, results, fields) {
          if (err) throw err;
          console.log("these are youre Odds", results);
          if(results.length === 0) {
             res.status(204).send({ message: 'error!' })
             } else {
             res.status(200).send({
               results: results
               })
             }
        })
});

//17:BPMS echtgeld zu Coins
app.get('/sendMoney/:value/:userID', (req, res) => {
    const sql = "UPDATE `users` SET `Kontostand` = `Kontostand` + "+req.params.value+" WHERE `users`.`id` = "+req.params.userID+";";
                  connection.query(sql, function (err, results, fields) {
                  if (err) throw err;
                  if(results.length === 0) {
                     res.status(204).send({ message: 'error!' })
                     } else {
                     res.status(200).send({
                       message: 'you have money'
                       })
                     }
                })
});

//18:BPMS coins zu echtgeld
app.get('/receiveMoney/:value/:userID', (req, res) => {

    const sql = "UPDATE `users` SET `Kontostand` = `Kontostand`-'"+req.params.value+"' WHERE `users`.`id` ="+req.params.userID+" AND `Kontostand` >= '"+req.params.value+"'; ";
                  connection.query(sql, function (err, results, fields) {
                  if (err) throw err;
                  if(results.length === 0) {
                     res.status(204).send({ message: 'error!' })
                     } else {
                     res.status(200).send({
                       message: 'you have money'
                       })
                     }
                })
});

//19: BPMS Wetten eintragen
app.get('/placeBet/:hgoal/:ggoals/:userID/:spielID/:value', (req, res) => {
         const sql = "INSERT INTO `wetten`(`spiel_id`, `user_id`, `homegoal`, `guestGoal`, `value`) VALUES ('"+spielID+"','"+userID+"','"+hgoal+"','"+ggoal+"','"+value+"')";
               connection.query(sql, function (err, results, fields) {
               if (err) throw err;
               console.log("new bet created", results);
               if(results.length === 0) {
                  res.status(204).send({ message: 'error!' })
                  } else {
                  res.status(200).send({
                    message: 'new bet created'
                    })
                  }
             })
});