const isLogin = async (req,res,next)=>{
    try {
        if(req.session.user_id){}
        else{
            res.redirect('/')
        }
        next();
    } catch (err) {
        console.log(err)
    }
}


const isLogout = async (req,res,next)=>{
    try {
        if(req.session.user_id){
            res.redirect('/home')
        }
        next();
    } catch (err) {
        console.log(err)
    }
}

module.exports={
    isLogin,
    isLogout
}