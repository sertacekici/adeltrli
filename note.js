
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
            
            const ysCustomerList = db.collection("ysCustomerList");
            
  
            const recordCheck = await ysCustomerList
              .where("lisanceID", "==", snapshot.id)
              .get();
  
            const customerSnapShot = await db
              .collection("customers")
              .doc(snapshot.data().lisanceCustomer)
              .get();
  
            if (recordCheck.docs.length > 0) {
            } else {
              // Yemek Sepeti Ozel Data Toplama Kodu
              if (snapshot.data().lisanceProduct === "LdiFP2XLzkxZk9xTLr2f") {
                /*    const customerSnapShot = await db
                  .collection("customers")
                  .doc(snapshot.data().lisanceCustomer)
                  .get(); */
  
                const ysList = {
                  lisanceID: snapshot.id,
                  lisanceCustomerID: snapshot.data().lisanceCustomer,
                  lisanceCustomerCategoryName: userpass,
                  lisanceCustomerName: customerSnapShot.data().customerName,
                };
  
                ysCustomerList.add(ysList);
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