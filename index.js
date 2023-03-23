console.log("Hello, World! web scraping")
// downloading the target web page 
// by performing an HTTP GET request in Axios

/*M1*/
const cheerio = require("cheerio")
const axios = require("axios")
const arrayData = [];
const arrayDataSaved = [];
const cadenaEmails = [];
/*M1: Estas instrucciones importan las bibliotecas "cheerio" y "axios", 
luego crean tres arrays vacíos que se utilizarán más adelante en el código*/

/*M2*/
var cadenaSimple = "";
var fileUrl = "./srcData/journalcsvIT10.csv";
var fileUrlSaved = "./srcData/journalDataFinish.csv";
var emailFound = "";
/*M2: Estas instrucciones declaran variables, algunas de ellas contienen la 
ruta de algunos archivos*/

/*M3*/
async function performScraping() {
    let dataFull;
    const fs = require("fs");

    function setTowrite(data) {
        if (data !== "" && data.split(",").length > 0) {
            fs.writeFile(fileUrlSaved, data, "utf-8", (err) => {
                if (err) console.log(err);
                else console.log("*************Data saved*****************");
            });
        } else {
            console.log("*************Data  not saved*****************");
            console.log(data);
        }
    }
/*M3: Estas instrucciones realizan un proceso de web scraping donde valida que 
al menos se contenga una ",", desplegando un mensaje si la información ha sido 
guardada o no dentro de nuestro parámetro data*/

/*M4*/
    function readInfoFromFileSaved() {
        fs.readFile(fileUrlSaved, "utf-8", (err, data) => {
            if (err) {
                console.log(err);
            }
            const axiosResponse = null;
            const lines = data.split(/\r\n|\r|\n/, -1);
            console.log("************tamaño de lineas de csv saved**********" + lines.length);
            cont = 0;
            lines.forEach((item, value) => {
                cont++;
                if (item != "") {
                    arrayDataSaved.push(item);
                    console.log("*************leido del csv guardado************************");
                    console.log(item);
                }
            });
            console.log("***************data full saved*************");
            console.log(lines);
        });
    }
/*M4: Estas instrucciones leen un archivo de texto y devuelven su contenido en la variable
"data", verifica si se produjo un error al leer el archivo y de ser así lo imprime en la 
consola, posterior a ello se divide el contenido en líneas y se almacenan en un array
llamado "lines", no se descarta ninguna línea al dividir el archivo, a su vez, se imprime en la 
consola el número de líneas que se leyeron del archivo, se muestra en consola cuando
se ha leído todo el archivo e imprime el contenido en forma de array */
    function getEmailPage(url, nombre, urlJournalDoaj, urlJournalIssn, urlJournalEissn) {
        var resp = "";
        const params = {
            responsive: true,
            destination: 'New+York%2C+New+York',
            latLong: '40.75668%2C-73.98647',
            regionId: 178293,
            startDate: '01%2F20%2F2019',
            endDate: '01%2F21%2F2019',
            rooms: 1,
            adults: 2,
            timezoneOffset: 19800000,
            langid: 1033,
            hsrIdentifier: 'HSR',
            page: 7
        }
        axios.get(url).then(res => {
            const $ = cheerio.load(res.data)
            // parsing the HTML source of the target web page with Cheerio
            //const fileData = cheerio.load(fileResponse.data)
            console.log("csv data::::::");
            //get emails data
            const objJournalEmails = [];
            var emailLatest = "";
            var added = "";
            // scraping the "What makes Bright Data
            // the undisputed industry leader" section
            var ele = $(".journalContacts").html();
            //console.log($(".journalContacts").html())
            if (ele != null) {
                console.log("journalContacts::::::::" + url);
                $(".journalContacts").find("div").each((index, element) => {
                    const email = $(element).find("div").text()
                    /* console.log("data div email::::::");
                    console.log(email) */
                    if (email != "") {
                        const lines = email.split("\n");
                        var justEmail = "";
                        console.log("sizelines of page element:::" + lines.length);
                        for (var is = 0; is < lines.length; is++) {
                            if (lines[is].includes("\@")) {
                                //console.log("lineEmail:::" + lines[is].trim());
                                if (lines[is].includes(":")) {
                                    justEmail = "" + lines[is].split(":")[1].trim();
                                } else {
                                    justEmail = "" + lines[is].trim();
                                }
                                if (justEmail != "" && justEmail != emailLatest) {
                                    const journalEmail = {
                                        nombre: nombre,
                                        email: justEmail,
                                        urlJournal: url,
                                        urlJournalDoaj: urlJournalDoaj,
                                        urlJournalIssn: urlJournalIssn,
                                        urlJournalEissn: urlJournalEissn
                                    }
                                    console.log("seteando email de pagina:::::" + justEmail);
                                    emailLatest = justEmail;
                                    urlLatest = url;
                                    emailFound = "OK";
                                    cadenaSimple += nombre + "," + url + "," + "Found:" + emailFound + "," + justEmail + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
                                }
                            }
                        }
                        if (emailFound == "" && added == "") {
                            console.log("::::::::::::::seteando elemento vacio::::::::::::" + justEmail);
                            emailFound = "";
                            added = "seted";
                            cadenaSimple += nombre + "," + url + "," + "Found: NOT!!!" + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
                        }
                    }
                });
            } else if ($(".contact_section").html() !== null) {
                console.log("contact_section+++++++++++++");
                $(".contact_section").find("div").each((index, element) => {
                    const email = $(element).find("div").text();
                    console.log("data div email+++++++++++++");
                    //console.log($(element).html())
                    if (email != "") {
                        const lines = email.split("\n");
                        var justEmail = "";
                        console.log("sizelines of page element+++++++++++++" + lines.length);
                        for (var is = 0; is < lines.length; is++) {
                            console.log("checando++++++++++++++++++++++++")
                            ////console.log(lines[is])
                            if (lines[is].includes("\@")) {
                                //console.log("lineEmail+++++++++++++" + lines[is].trim());
                                if (lines[is].includes(":")) {
                                    justEmail = "" + lines[is].split(":")[1].trim();
                                } else {
                                    justEmail = "" + lines[is].trim();
                                }
                                if (justEmail != "" && justEmail != emailLatest) {
                                    const journalEmail = {
                                        nombre: nombre,
                                        email: justEmail,
                                        urlJournal: url,
                                        urlJournalDoaj: urlJournalDoaj,
                                        urlJournalIssn: urlJournalIssn,
                                        urlJournalEissn: urlJournalEissn
                                    }
                                    /*M5*/
                                    console.log("seteando email de pagina+++++++++++++" + justEmail);
                                    emailLatest = justEmail;
                                    emailFound = "OK";
                                    cadenaSimple += nombre + "," + url + "," + "Found:" + emailFound + "," + justEmail + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
                                    /*M5: Estas instrucciones imprimen en consola un aviso que ha encontrado un correo y de igual forma lo imprime*/
                                }
                            }
                        }
                        if (emailLatest == "" && added == "") {
                            console.log("+++++++++++seteando elemento vacio+++++++++++++" + justEmail);
                            emailFound = "";
                            added = "seted";
                            cadenaSimple += nombre + "," + url + "," + "Found: NOT!!!" + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
                        }
                    }
                });
            } else if ($(".journal-description__content").html() !== null) {
                console.log("journal-description__content<<<<<<<<<<<<<");
                $(".journal-description__content").find("div").each((index, element) => {
                    const email = $(element).find("div").text();
                    console.log("data div email<<<<<<<<<<<<<");
                    //console.log($(element).html())
                    if (email != "") {
                        const lines = email.split("\n");
                        var justEmail = "";
                        console.log("sizelines of page element<<<<<<<<<<<<<" + lines.length);
                        for (var is = 0; is < lines.length; is++) {
                            console.log("checando<<<<<<<<<<<<<<<<<<<<<<<<")
                            ////console.log(lines[is])
                            if (lines[is].includes("\@")) {
                                //console.log("lineEmail<<<<<<<<<<<<<"+ lines[is].trim());
                                if (lines[is].includes(":")) {
                                    justEmail = "" + lines[is].split(":")[1].trim();
                                } else {
                                    justEmail = "" + lines[is].trim();
                                }
                                if (justEmail != "" && justEmail != emailLatest) {
                                    const journalEmail = {
                                        nombre: nombre,
                                        email: justEmail,
                                        urlJournal: url,
                                        urlJournalDoaj: urlJournalDoaj,
                                        urlJournalIssn: urlJournalIssn,
                                        urlJournalEissn: urlJournalEissn
                                    }
                                    console.log("seteando email de pagina<<<<<<<<<<<<<" + justEmail);
                                    emailLatest = justEmail;
                                    emailFound = "OK";
                                    cadenaSimple += nombre + "," + url + "," + "Found:" + emailFound + "," + justEmail + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
                                }
                            }
                        }
                        if (emailLatest == "" && added == "") {
                            console.log("<<<<<<<<<<<seteando elemento vacio<<<<<<<<<<<<<" + justEmail);
                            emailFound = "";
                            added = "seted";
                            cadenaSimple += nombre + "," + url + "," + "Found: NOT!!!" + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
                        }
                    }
                });
            }
            else if ($("#contact").html() !== null) {
                console.log("#contact>>>>>>>>>>>>>");
                $("#contact").find("div").each((index, element) => {
                    const email = $(element).find("p").text();
                    console.log("data div email>>>>>>>>>>>>>");
                    //console.log($(element).html())
                    if (email != "") {
                        const lines = email.split("\n");
                        var justEmail = "";
                        console.log("sizelines of page element>>>>>>>>>>>>>"+ lines.length);
                        for (var is = 0; is < lines.length; is++) {
                            console.log("checando>>>>>>>>>>>>>>>>>>>>>>>>")
                            console.log(lines[is])
                            if (lines[is].includes("\@")) {
                                //console.log("lineEmail>>>>>>>>>>>>>"+ lines[is].trim());
                                if (lines[is].includes(":")) {
                                    justEmail = "" + lines[is].split(":")[1].trim();
                                    added = "seted";
                                } else {
                                    justEmail = "" + lines[is].trim();
                                    added = "seted";
                                }
                                if (justEmail != "" && justEmail != emailLatest) {
                                    const journalEmail = {
                                        nombre: nombre,
                                        email: justEmail,
                                        urlJournal: url,
                                        urlJournalDoaj: urlJournalDoaj,
                                        urlJournalIssn: urlJournalIssn,
                                        urlJournalEissn: urlJournalEissn
                                    }
                                    console.log("seteando email de pagina>>>>>>>>>>>>>"+ justEmail);
                                    emailLatest = justEmail;
                                    emailFound = "OK";
                                    cadenaSimple += nombre + "," + url + "," + "Found:" + emailFound + "," + justEmail + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
                                    added = "seted";
                                }
                            }
                        }
                        if (justEmail=="" && added == "") {
                            console.log(">>>>>>>>>>>seteando elemento vacio>>>>>>>>>>>>>"+ justEmail);
                            emailFound = "";
                            added = "seted";
                            cadenaSimple += nombre + "," + url + "," + "Found: NOT!!!" + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
                        }
                    }
                });
            }
            
            if (emailLatest == "" && added == "") {
                console.log("+++++++++++seteando elemento vacio+++++++++++++");
                added = "seted";
                cadenaSimple += nombre + "," + url + "," + "Found: NOT!!!" + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
            }
            readInfoFromFileSaved();
            setTowrite(cadenaSimple);
        }).catch(function(error) {
            if (error.response) {
                // Request made and server responded
                console.log("*************fallo la llamada de url de revista********************");
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log("+++++++++++seteando elemento vacio+++++++++++++");
            added = "seted";
            cadenaSimple += nombre + "," + url + "," + "Found: NOT!!!" + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
            
            readInfoFromFileSaved();
            setTowrite(cadenaSimple);
        }); ///fin axios get
        return emailFound;
    }
    fs.readFile(fileUrl, "utf-8", (err, data) => {
        if (err) {
            console.log(err);
        }
        const axiosResponse = null;
        //else console.log(data);
        const lines = data.split(/\r\n|\r|\n/, -1);
        //console.log( lines ); // HTML content of the jQuery.ajax page
        console.log("tamaño de lineas de csv:::::" + lines.length);
        cont = 0;
        lines.forEach((item, value) => {
            cont++;
            const objfromcsv = {
                nombre: item.split(",")[0],
                urlJournal: item.split(",")[1],
                urlJournalDoaj: item.split(",")[2],
                urlJournalIssn: item.split(",")[5],
                urlJournalEissn: item.split(",")[6],
            }
            if (value != "" && cont > 1) {
                arrayData.push(objfromcsv);
                /*           console.log(item.split(",")[1]);
                 */
            }
        });
        console.log("tamaño de lineas de csv minified:::::" + arrayData.length);
        arrayData.forEach((item, value) => {
            var url = (~item.urlJournal.indexOf(".php/") && !item.urlJournal.endsWith("/index")) ? item.urlJournal + "/about/contact.html" : item.urlJournal;
            var url = (~item.urlJournal.indexOf(".php/") && !item.urlJournal.endsWith("/index")) ? item.urlJournal + "/about/contact" : item.urlJournal;
            var url = (~item.urlJournal.indexOf(".net/")) ? item.urlJournal + "about/contact.html" : item.urlJournal;
            url = item.urlJournal.endsWith("/index") ? item.urlJournal.substring(0, item.urlJournal.length - 5) + "about/contact" : url;
            url = item.urlJournal.endsWith("home/afr") ? item.urlJournal.substring(0, item.urlJournal.length - 8) + "description/AFR" : url;
            console.log(":::::::::::::url ::::::::::::::::: " + url);
            for (var sec = 0; sec < 3; sec++) {
                console.log("estado de email::::::::::::::::: ");
                console.log("email found::::::::: " + emailFound);
                url = sec == 1 ? item.urlJournalDoaj : sec == 2 ? item.urlJournalDoaj : url;
                console.log("***********peticion a pagina de revista*******");
                console.log("url leida:::::::::::::::::" + "poss::::" + sec + "  " + url);
                if (emailFound == "" && sec == 0) {
                    getEmailPage(url, item.nombre, item.urlJournalDoaj, item.urlJournalIssn, item.urlJournalEissn);
                } else if (emailFound != "OK" && sec == 4) {
                    console.log("***********no se encontro el email en su pagina se intenta con doaj*******");
                    console.log("url leida segunda::::::::::::::::: " + item.urlJournalDoaj);
                    getEmailPage(url, item.nombre, item.urlJournalDoaj, item.urlJournalIssn, item.urlJournalEissn);
                }
            }
            added = "";
        });
    }); ////finish of read csv
}
performScraping();