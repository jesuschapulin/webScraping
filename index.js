console.log("Hello, World! web scraping")
// downloading the target web page 
// by performing an HTTP GET request in Axios
const cheerio = require("cheerio")
const axios = require("axios")
const arrayData = [];
const arrayDataLatindex = [];
const arrayDataCSI = [];
const arrayDataSaved = [];
const arrayDataSavedRelations = [];
const cadenaEmails = [];
var cadenaSimple = "";
var fileUrl = "./srcData/journalcsvIT10.csv";
var fileUrlSaved = "./srcData/journalDataFinish.csv";
var fileLatindexUrl = "./srcData/latindex2023T10.csv";
var fileCsimagoUrl = "./srcData/scimagojr 2021T10.csv";
var fileRelationsLatUrlSaved = "./srcData/journalDataFinish-relationLatindex.csv";
var emailFound = "";
async function readRelationsLatindexCsi() {
    let dataFull;
    const fs = require("fs");

    function setTowrite(data) {
        if (data !== "" && data.split(",").length > 0) {
            fs.writeFile(fileRelationsLatUrlSaved, data, "utf-8", (err) => {
                if (err) console.log(err);
                else console.log("-------------Data saved-----------------");
            });
        } else {
            console.log("-------------Data  not saved-----------------");
            console.log(data);
        }
    }

    function readInfoFromFileSaved() {
        fs.readFile(fileRelationsLatUrlSaved, "utf-8", (err, data) => {
            if (err) {
                console.log(err);
            }
            const lines = data.split(/\r\n|\r|\n/, -1);
            console.log("------------tamaño de lineas de csv saved----------" + lines.length);
            cont = 0;
            lines.forEach((item, value) => {
                cont++;
                if (item != "") {
                    arrayDataSavedRelations.push(item);
                    console.log("-------------leido del csv guardado------------------------");
                    console.log(item);
                }
            });
            console.log("---------------data full saved-------------");
            console.log(lines);
        });
    }

    function createRelationsJournals(nombre, issn, eissn, correo) {
        cadenaSimple+=nombre+","+ issn+","+ eissn+","+ correo+"\n";
        console.log("--------------- reading every foreach-------------");
        readInfoFromFileSaved();
        setTowrite(cadenaSimple);
    }
    fs.readFile(fileLatindexUrl, "utf-8", (err, data) => {
        if (err) {
            console.log(err);
        }
        //else console.log(data);
        const lines = data.split(/\r\n|\r|\n/, -1);
        //console.log( lines ); // HTML content of the jQuery.ajax page
        console.log("tamaño de lineas de csv:::::" + lines.length);
        cont = 0;
        lines.forEach((item, value) => {
            cont++;
            var nombre = item.split(",").length > 0 ? (item.split(",")[1]) : nombre;
            var issn = (item.split(",").length > 0 && item.split(",")[2].split("-").length > 0) ? (item.split(",")[2]) : issn;
            issn = (item.split(",").length > 0 && item.split(",")[3].split("-").length > 0 && issn=="") ? (item.split(",")[3]) : issn;
            var Eissn = (item.split(",").length > 4 && item.split(",")[4].split("-").length > 0) ? (item.split(",")[4]) : "";
            Eissn = (item.split(",").length > 5 && item.split(",")[5].split("-").length > 0 && Eissn=="") ? (item.split(",")[5]) : Eissn;
            var correo = (item.split(",").length >= 3 && item.split(",")[3]!="") ? (item.split(",")[3]) : "";
            correo = (item.split(",").length > 7 && item.split(",")[7] && correo=="") ? (item.split(",")[7]) : correo;
            console.log("tam de linea en ,"+item.split(",").length+" :::::: item :::: " + item);
            console.log(":::::: issn :::: " + issn + "::::::: eissn::::: " + Eissn);
            const objfromcsv = {
                nombre: nombre,
                issn: issn,
                Eissn: Eissn,
                correo: correo
            }
                arrayDataLatindex.push(objfromcsv);
                console.log("::::::nombre:::: " + nombre + "\n:::::::correo::::: " + correo);
            
        });
        console.log("tamaño de lineas de csv minified:::::" + arrayDataLatindex.length);
        arrayDataLatindex.forEach((item, value) => {
            console.log("::::::::::::: leyendo obj de csv ::::::::::::::::: ");
            setTimeout(createRelationsJournals, 1000, item.nombre, item.issn, item.Eissn, item.correo);
        });
    }); ////finish of read csv
}
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
        const options = {
            xsrfCookieName: 'XSRF-TOKEN',
            xsrfHeaderName: 'X-XSRF-TOKEN',
        };
        axios.get(url, {}, {
            timeout: 6000
        }).then(res => {
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
                                    console.log("seteando email de pagina+++++++++++++" + justEmail);
                                    emailLatest = justEmail;
                                    emailFound = "OK";
                                    cadenaSimple += nombre + "," + url + "," + "Found:" + emailFound + "," + justEmail + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
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
            } else if ($("#contact").html() !== null) {
                console.log("#contact>>>>>>>>>>>>>");
                $("#contact").find("div").each((index, element) => {
                    const email = $(element).find("p").text();
                    console.log("data div email>>>>>>>>>>>>>");
                    //console.log($(element).html())
                    if (email != "") {
                        const lines = email.split("\n");
                        var justEmail = "";
                        console.log("sizelines of page element>>>>>>>>>>>>>" + lines.length);
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
                                    console.log("seteando email de pagina>>>>>>>>>>>>>" + justEmail);
                                    emailLatest = justEmail;
                                    emailFound = "OK";
                                    cadenaSimple += nombre + "," + url + "," + "Found:" + emailFound + "," + justEmail + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
                                    added = "seted";
                                }
                            }
                        }
                        console.log(">>>>>>>>>>> positions >>>>>>>>>>>>>" + lines.length + " >>>>>>>> " + is);
                        if (lines.length - 1 == is && emailLatest == "" && added == "") {
                            console.log(">>>>>>>>>>>seteando elemento vacio>>>>>>>>>>>>>" + justEmail);
                            emailFound = "";
                            added = "seted";
                            cadenaSimple += nombre + "," + url + "," + "Found: NOT!!!" + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
                        }
                    }
                });
            }else if ($(".contact").html() !== null) {
                console.log(".contact;;;;;;;;;;;;;");
                $(".contact").find(".email").each((index, element) => {
                    const email = $(element).find("a").text();
                    console.log("data div email;;;;;;;;;;;;;");
                    //console.log($(element).html())
                    if (email != "") {
                        const lines = email.split("\n");
                        var justEmail = "";
                        console.log("sizelines of page element;;;;;;;;;;;;;" + lines.length);
                        for (var is = 0; is < lines.length; is++) {
                            console.log("checando;;;;;;;;;;;;;;;;;;;;;;;;")
                            console.log(lines[is])
                            if (lines[is].includes("\@")) {
                                //console.log("lineEmail;;;;;;;;;;;;;"+ lines[is].trim());
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
                                    console.log("seteando email de pagina;;;;;;;;;;;;;" + justEmail);
                                    emailLatest = justEmail;
                                    emailFound = "OK";
                                    cadenaSimple += nombre + "," + url + "," + "Found:" + emailFound + "," + justEmail + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
                                    added = "seted";
                                }
                            }
                        }
                        console.log(";;;;;;;;;;; positions ;;;;;;;;;;;;;" + lines.length + " ;;;;;;;; " + is);
                        if (lines.length - 1 == is && emailLatest == "" && added == "") {
                            console.log(";;;;;;;;;;;seteando elemento vacio;;;;;;;;;;;;;" + justEmail);
                            emailFound = "";
                            added = "seted";
                            cadenaSimple += nombre + "," + url + "," + "Found: NOT!!!" + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
                        }
                    }
                });
            } else if ($(".footer").html() !== null) {
                console.log(".footer-------------");
                $(".footer").each((index, element) => {
                    const email = $(element).find("a").text();
                    console.log("data div email-------------");
                    //console.log($(element).html())
                    if (email != "") {
                        const lines = email.split("\n");
                        var justEmail = "";
                        console.log("sizelines of page element-------------" + lines.length);
                        for (var is = 0; is < lines.length; is++) {
                            console.log("checando------------------------")
                            console.log(lines[is])
                            if (lines[is].includes("\@")) {
                                //console.log("lineEmail-------------"+ lines[is].trim());
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
                                    console.log("seteando email de pagina-------------" + justEmail);
                                    emailLatest = justEmail;
                                    emailFound = "OK";
                                    cadenaSimple += nombre + "," + url + "," + "Found:" + emailFound + "," + justEmail + "," + urlJournalIssn + "," + urlJournalEissn + "\n";
                                    added = "seted";
                                }
                            }
                        }
                        if (justEmail == "" && added == "") {
                            console.log("-----------seteando elemento vacio-------------" + justEmail);
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
            var nombre = item.split(",http").length > 0 ? (item.split(",http")[0]) : nombre;
            var urlJournal = item.split(",http").length > 0 ? "http" + (item.split(",http")[1]) : urlJournal;
            urlJournal = urlJournal.includes(",") ? urlJournal.split(",")[0] : urlJournal;
            const objfromcsv = {
                nombre: nombre,
                urlJournal: urlJournal,
                urlJournalDoaj: item.split(",")[2],
                urlJournalIssn: item.split(",")[5],
                urlJournalEissn: item.split(",")[6],
            }
            if (value != "" && cont > 1) {
                arrayData.push(objfromcsv);
                console.log(item.split(",")[1]);
                console.log("::::::nombre:::: " + nombre + "\n:::::::url::::: " + urlJournal);
            }
        });
        console.log("tamaño de lineas de csv minified:::::" + arrayData.length);
        arrayData.forEach((item, value) => {
            var url = (~item.urlJournal.indexOf(".php/") && !item.urlJournal.endsWith("/index") && !item.urlJournal.includes("www.scielo.")) ? item.urlJournal + "/about/contact" : item.urlJournal;
            url = item.urlJournal.endsWith("/index") ? item.urlJournal.substring(0, item.urlJournal.length - 5) + "about/contact" : url;
            url = item.urlJournal.endsWith("home/afr") ? item.urlJournal.substring(0, item.urlJournal.length - 8) + "description/AFR" : url;
            console.log(":::::::::::::url formada ::::::::::::::::: " + url);
            for (var sec = 0; sec < 3; sec++) {
                console.log("estado de email::::::::::::::::: ");
                console.log("email found::::::::: " + emailFound);
                url = sec == 1 ? item.urlJournalDoaj : sec == 2 ? item.urlJournalDoaj : url;
                console.log("***********peticion a pagina de revista*******");
                console.log("url leida:::::::::::::::::" + "poss::::" + sec + "  " + url);
                if (emailFound == "" && sec == 0) {
                    setTimeout(getEmailPage, 2000, url, item.nombre, item.urlJournalDoaj, item.urlJournalIssn, item.urlJournalEissn);
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
/* readRelationsLatindexCsi(); */