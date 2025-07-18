import mongoose from "mongoose";
const PurchaseSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Purchase", PurchaseSchema);
