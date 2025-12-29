const authornot = (cont) =>{
    const authcontrol = cont.req.authSelect;
    console.log(authcontrol)
    if (authcontrol) {
      return {
        success: false,
        message: "Authentication required",
      }
    }
}

module.exports = authornot;