import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    realName: {
        type: String,
        required: true,
        trim: true
    },
    leetcodeUsername: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    totalSolved: {
        type: Number,
        default: 0
    },
    easySolved: {
        type: Number,
        default: 0
    },
    mediumSolved: {
        type: Number,
        default: 0
    },
    hardSolved: {
        type: Number,
        default: 0
    },
    ranking: {
        type: Number,
        default: 0
    },
    acceptanceRate: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);
