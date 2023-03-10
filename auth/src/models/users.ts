import mongoose from 'mongoose'
import { Password } from '../utils/password';

// an interface used to combine ts to confirm the data type when create a new user
interface UserAttri{
    email: string;
    password: string;
    isAdmin: boolean;
}

// an interface that describes the properties that a User Model has
// so we can use User.build to invoke the static build method
interface UserModel extends mongoose.Model<UserDoc>{
    build(attri : UserAttri) : UserDoc;
}

// An interface that describes the properties that a User Document has
// the attribute that a user has but not be compulsory for new User when create a new user
interface UserDoc extends mongoose.Document{
    email: string;
    password: string;
    isAdmin: boolean;
    status: boolean;
}

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret){
            // unify the format of return user model
            ret.id = ret._id
            delete ret._id
            delete ret.__v
            delete ret.password
        }
    }
})


UserSchema.pre('save', async function(done){
    if(this.isModified('password')){
        const hashedPassword = await Password.toHash(this.get('password'))
        this.set('password', hashedPassword)
    }
    done()
})

// create a method called build which can be invoke by User
UserSchema.statics.build = (attr: UserAttri) => {
    return new User(attr)
}

const User = mongoose.model<UserDoc, UserModel>("User", UserSchema)

export { User }

