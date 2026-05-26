const { ApolloServer } = require("apollo-server-express");
const cookieParser = require("cookie-parser");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const cors = require("cors");
const express = require("express");
const auth = require("basic-auth");
const http = require("http");
const db = require("./db");
const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers");
const date = require("date-and-time");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 4000;

const jsonParser = bodyParser.json();

/* const mwBasicAuth = async (req, res, next) => {
  const user = await auth(req);
  console.log(user)
  const username = "ypZE7QDAVkHq75pVquMvg";
  const password = "Z5V8EjC3fkSofGnKV4hmKg";

  if (user === undefined || user.name !== username || user.pass !== password) {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    res.status(401).send("Authentication required");
  } else {
    next();
  }
}; 
 */
async function startApolloServer(typeDefs, resolvers) {
  // Required logic for integrating with Express
  const app = express();
  //app.use(express.json());
  //app.use(mwBasicAuth);
  app.use(cookieParser());
  app.get(
    "/lisancecheck/:username/:userpass/:lisancecode",
    async (req, res) => {
      const username = req.params.username;
      const userpass = req.params.userpass;
      const lisancecode = req.params.lisancecode;

      const lisanceSnapshot = db.collection("lisances").doc(lisancecode).get();

      const lisanceResult = await lisanceSnapshot.then(async (snapshot) => {
        if (snapshot.exists) {
          const lisancefinishDate = snapshot.data().lisanceFinishDate;
          const lisancestatus = snapshot.data().lisanceStatus;
          const lisancecustomer = snapshot.data().lisanceCustomer;

          if (lisancestatus === "0") {
            return {
              __typename: "ResponseAll",
              success: false,
              message: "Lisance is not active",
            };
          }

          const dayLisance = new Date(lisancefinishDate);
          const fndate = new Date(dayLisance);
          const dayNow = new Date();
          const daycount = date.subtract(fndate, dayNow).toDays();
          const daycountMath = Math.round(daycount);

          const isEqual = await bcrypt.compare(
            userpass,
            snapshot.data().swuserpass
          );
          const isEqual2 = await bcrypt.compare(
            username,
            snapshot.data().swusername
          );

          if (!isEqual) {
            return {
              lisanceStatus: "userpassfalse",
              lisanceRemainDays: 0,
              success: false,
              message: "User Passwords is not correct",
            };
          }
          if (!isEqual2) {
            return {
              lisanceStatus: "usernamefalse",
              lisanceRemainDays: 0,
              success: false,
              message: "User Name is not correct",
            };
          }
          //daycountMath is show how long time remaining to finish lisance
          if (daycountMath <= 0) {
            return {
              lisanceStatus: "lisancefinished",
              lisanceRemainDays: 0,
              success: false,
              message: "User lisance is finished",
            };
          } else {
            const gtrCustomerList = db.collection("gtrCustomerList");

            const recordCheck = await gtrCustomerList
              .where("lisanceID", "==", snapshot.id)
              .get();

            const customerSnapShot = await db
              .collection("customers")
              .doc(snapshot.data().lisanceCustomer)
              .get();

            if (recordCheck.docs.length > 0) {
            } else {
              // Yemek Sepeti Ozel Data Toplama Kodu
              if (snapshot.data().lisanceProduct === "B4wx6EqA2lwWxfTpUlYO") {
                /*    const customerSnapShot = await db
                  .collection("customers")
                  .doc(snapshot.data().lisanceCustomer)
                  .get(); */

                const gtrList = {
                  lisanceID: snapshot.id,
                  lisanceCustomerID: snapshot.data().lisanceCustomer,
                  lisanceRestaurantID: userpass,
                  lisanceCustomerName: customerSnapShot.data().customerName,
                };

                gtrCustomerList.add(gtrList);
              }
            }

            // Yemek Sepeti Ozel Data Toplama Kodu Bitis

            return {
              lisanceStatus: "active",
              lisanceRemainDays: daycountMath,
              success: true,
              message: "User lisance is active",
              customerCode: lisancecustomer,
              customerPhone: customerSnapShot.data().customerPhone,
              customerName: customerSnapShot.data().customerName,
            };
          }
        } else {
          return {
            lisanceStatus: "lisancenotfound",
            lisanceRemainDays: 0,
            success: false,
            message: "Lisance Not Found",
          };
        }
      });

      res.send(lisanceResult);
    }
  );

  app.post("/lisancerequest", jsonParser, async (req, res) => {
    try {
      const {
        Username,
        UserPass,
        LicenseCustomer,
        LicenceProduct,
        CustomerName,
        ProductName,
        LicenseNote,
        Tarih,
      } = req.body;

      const lisanceAdd = {
        ProductName,
        CustomerName,
        LicenseCustomer,
        LicenceProduct,
        LicenseNote,
        Username,
        UserPass,
        Tarih,
      };

      const lisanceSnapshot = db.collection("lisancerequests");

      if (
        !Username ||
        !UserPass ||
        !LicenseCustomer ||
        !LicenceProduct ||
        !CustomerName ||
        !ProductName ||
        !LicenseNote ||
        !Tarih
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const docRef = await lisanceSnapshot.add(lisanceAdd);

      console.log(docRef.id);
      res.status(201).json({
        success: true,
        message: docRef.id,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  // Gelen lisance document id'lerini firestore'a kaydeder.
  app.post("/adeluzatmatalep", jsonParser, async (req, res) => {
    try {
      const body = req.body || {};
      let ids = body.documentIds || body.ids || body.lisanceIds;

      if (!ids && body.documentId) {
        ids = [body.documentId];
      }
      if (typeof ids === "string") {
        ids = [ids];
      }
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "documentIds (array) is required",
        });
      }

      const cleanIds = ids
        .map((id) => (id === null || id === undefined ? "" : String(id).trim()))
        .filter((id) => id.length > 0);

      if (cleanIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "documentIds (array) is required",
        });
      }

      const collectionRef = db.collection("uzatmatalep");
      const createdAt = new Date().toISOString();

      const savedIds = [];
      for (const lisanceDocId of cleanIds) {
        const docRef = await collectionRef.add({
          lisanceDocId,
          createdAt,
        });
        savedIds.push({ id: docRef.id, lisanceDocId });
      }

      res.status(201).json({
        success: true,
        count: savedIds.length,
        saved: savedIds,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  // uzatmatalep kayitlarini, lisans + musteri + urun bilgileri ile zenginlestirip dondurur.
  app.get("/adeluzatmatalep", async (req, res) => {
    try {
      const snapshot = await db.collection("uzatmatalep").get();

      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const customerCache = new Map();
      const productCache = new Map();

      const getCustomer = async (id) => {
        if (!id) return null;
        if (customerCache.has(id)) return customerCache.get(id);
        const snap = await db.collection("customers").doc(id).get();
        const data = snap.exists ? snap.data() : null;
        customerCache.set(id, data);
        return data;
      };

      const getProduct = async (id) => {
        if (!id) return null;
        if (productCache.has(id)) return productCache.get(id);
        const snap = await db.collection("products").doc(id).get();
        const data = snap.exists ? snap.data() : null;
        productCache.set(id, data);
        return data;
      };

      const result = [];
      for (const rec of records) {
        const lisanceDocId = rec.lisanceDocId;
        let lisanceData = null;
        if (lisanceDocId) {
          const lisanceSnap = await db
            .collection("lisances")
            .doc(lisanceDocId)
            .get();
          if (lisanceSnap.exists) lisanceData = lisanceSnap.data();
        }

        let customerName = null;
        let customerPhone = null;
        let productName = null;
        let lisanceFinishDate = null;
        let lisanceNote = null;

        if (lisanceData) {
          lisanceFinishDate = lisanceData.lisanceFinishDate || null;
          lisanceNote = lisanceData.lisanceNote || null;

          const customer = await getCustomer(lisanceData.lisanceCustomer);
          if (customer) {
            customerName = customer.customerName || null;
            customerPhone = customer.customerPhone || null;
          }

          const product = await getProduct(lisanceData.lisanceProduct);
          if (product) {
            productName = product.productName || null;
          }
        }

        result.push({
          id: rec.id,
          lisanceDocId,
          createdAt: rec.createdAt || null,
          customerName,
          customerPhone,
          lisanceNote,
          lisanceFinishDate,
          productName,
        });
      }

      res.status(200).json({
        success: true,
        count: result.length,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  app.post("/customerrequest", jsonParser, async (req, res) => {
    try {
      const {
        CsRestoranAdi,
        CsYetkiliAdi,
        CsYetkiliTelefon,
        CsRestoranAdresi,
        CsTicariUnvan,
        CsVergiDairesi,
        CsVergiNumarasi,
        CsResmiAdres,
        CsYetkiliEmail,
      } = req.body;

      const customerAdd = {
        CsRestoranAdi,
        CsYetkiliAdi,
        CsYetkiliTelefon,
        CsRestoranAdresi,
        CsTicariUnvan,
        CsVergiDairesi,
        CsVergiNumarasi,
        CsResmiAdres,
        CsYetkiliEmail,
      };

      const customerSnapshot = db.collection("customerRequests");

      const docRef = await customerSnapshot.add(customerAdd);

      res.status(201).json({
        success: true,
        message: "Customer request added successfully",
      });

      console.log("Customer request processed successfully");
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  // clipboard sabit adlı document a güncellemek için kullanılır.

  app.post("/clipboard", jsonParser, async (req, res) => {
    //update clipboard
    const clipboard = req.body;
    const clipboardSnapshot = db.collection("clipboard").doc("sabit");

    try {
      await clipboardSnapshot.set(clipboard);
      res.status(200).json({
        success: true,
        message: "Clipboard updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  // clipboard sabit adlı document a okumak için kullanılır.

  app.get("/clipboard", async (req, res) => {
    const clipboardSnapshot = db.collection("clipboard").doc("sabit").get();
    const clipboardResult = await clipboardSnapshot.then(async (snapshot) => {
      return snapshot.data();
    });

    res.send(clipboardResult);
  });

  // müşteri kodu kayıtlı mı değil mi diye kontrol edeceğiz. Eğer kayıtlı ise true dönecek.
  app.get("/customercheck/:customercode", async (req, res) => {
    const customercode = req.params.customercode;
    const customerSnapshot = db.collection("customers").doc(customercode).get();
    const customerResult = await customerSnapshot.then(async (snapshot) => {
      return snapshot.exists;
    });

    res.send(customerResult);
  });

  app.get("/customercheck/phone/:phoneNumber", async (req, res) => {
    try {
      const phoneNumber = req.params.phoneNumber;
      
      // Telefon numarasına göre sorgu yapma
      const customersRef = db.collection("customers");
      const snapshot = await customersRef.where("customerPhone", "==", phoneNumber).get();
      
      if (snapshot.empty) {
        // Müşteri bulunamadı
        return res.status(404).json({ exists: false, message: "Müşteri bulunamadı" });
      } 
      
      // İlk eşleşen müşteriyi al (normalde telefon numarası benzersiz olmalı)
      const customerDoc = snapshot.docs[0];
      const customerCode = customerDoc.id; // Belge ID'si (customerCode)
      
      return res.status(200).json({ 
        exists: true, 
        customerCode: customerCode 
      });
      
    } catch (error) {
      console.error("Müşteri arama hatası:", error);
      return res.status(500).json({ error: "Sunucu hatası" });
    }
  });

  // Yemek Sepeti Chain Code Kontrolü
  app.get("/yschaincodecheck/:lcode", async (req, res) => {
    //ysChainCodes icinde kayıtlı olan dökümanlardan remodeID ise lcode eşit olanı getiriyoruz.
    const lcode = req.params.lcode;
    const ysChainCodeSnapshot = db
      .collection("ysChainCodes")
      .where("remoteID", "==", lcode)
      .get();

    const ysChainCodeResult = await ysChainCodeSnapshot.then(
      async (snapshot) => {
        return snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
      
      }
    );

    res.send(ysChainCodeResult);
  });

  // Yemek Sepeti Chain code ekleme

  app.post("/yschaincode", jsonParser, async (req, res) => {
    const ysChainCode = req.body;
    const ysChainCodeSnapshot = db.collection("ysChainCodes");

    // if ysChainCode.remoteId is not equal to remoteID in ysChainCodes collection, add ysChainCode to ysChainCodes collection else update ysChainCode in ysChainCodes collection
    const docRef = await ysChainCodeSnapshot
      .where("remoteID", "==", ysChainCode.remoteID)
      .get();
      // Eğer docRef boş değil ise update yapılacak
    if (docRef.docs.length > 0) {
      const docId = docRef.docs[0].id;
      await db.collection("ysChainCodes").doc(docId).update(ysChainCode);
      res.status(200).json({
        success: true,
        message: "Ys Chain Code updated successfully",
      });
    }
    // Eğer docRef boş ise yeni kayıt yapılacak
    else {
      await ysChainCodeSnapshot.add(ysChainCode);
      res.status(201).json({
        success: true,
        message: "Ys Chain Code added successfully",
      });
    }
  }

  );


  const httpServer = http.createServer(app);

  // Same ApolloServer initialization as before, plus the drain plugin.
  const server = new ApolloServer({
    typeDefs,
    resolvers,

    context: async ({ req, res, next }) => {
      const auths = await checkAuth(req);
      if (auths) {
        return { req, res, next };
      } else {
        next();
      }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    playground: {
      settings: {
        "request.credentials": "omit",
      },
    },
  });

  // More required logic for integrating with Express
  await server.start();

  app.use(
    cors({
      credentials: true,
      origin: [
        "https://studio.apollographql.com",
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:3001",
        "https://adelqrcode.netlify.app",
        "https://asikdoner.online",
        "https://adelpanel.netlify.app",
        "https://adelkontrol.netlify.app",
        "https://adelop.netlify.app",
      ],
    })
  );

  server.applyMiddleware({
    app,
    cors: false,
    path: "/",
  });

  // Modified server startup
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

startApolloServer(typeDefs, resolvers);

const checkAuth = async (req) => {
  const user = await auth(req);
  const username = "ypZE7QDAVkHq75pVquMvg";
  const password = "Z5V8EjC3fkSofGnKV4hmKg";
  if (user === undefined || user.name !== username || user.pass !== password) {
    return true;
  } else {
    return true;
  }
};
