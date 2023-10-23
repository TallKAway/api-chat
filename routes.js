const { model } = require('mongoose');
const userRouter = require('./routes/user.route');



model.exports = (app)=>{
    app.use('/chat', userRouter);
}