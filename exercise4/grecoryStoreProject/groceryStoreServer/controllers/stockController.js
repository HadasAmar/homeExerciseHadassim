import { Stock } from "../models/Stock.js";
import { Supplier } from "../models/Supplier.js";
import { Order } from "../models/Order.js";

// יצירת הזמנה אוטומטית לפי נתוני קופה
export const handleStockData = async (req, res) => {
    console.log("Handling stock data...");
    const purchase = req.body;
    console.log("purchase", purchase);

    try {
        const autoOrderedProductNames = [];

        for (const [productName, quantitySold] of Object.entries(purchase)) {
            const allStock = await Stock.find({});
            const stockItem = await Stock.findOne({ name: productName });
            if (!stockItem) {
                console.log(`⚠️ Product does not exist: ${productName}`);
                continue;
            }

            if (!stockItem) continue;

            // עדכון הכמות במלאי
            stockItem.quantity -= quantitySold;
            await stockItem.save();

            if (stockItem.quantity < stockItem.minQuantity) {
                // חיפוש הספק הזול ביותר
                const suppliers = await Supplier.find({
                    "products.name": productName
                });


                //if there is no supplier for the product
                if (suppliers.length === 0) {
                    console.log(`⚠️ No supplier found with the product: ${productName}`);
                    continue;
                }

                //searching for the cheapest supplier
                let bestOption = null;
                for (const supplier of suppliers) {
                    const product = supplier.products.find(p => p.name === productName);
                    if (product) {
                        if (!bestOption || product.price < bestOption.price) {
                            bestOption = {
                                supplierId: supplier._id,
                                supplierName: supplier.companyName,
                                productId: product._id,
                                productName: product.name,
                                minQuantity: product.minQuantity,
                                price: product.price
                            };
                        }
                    }
                }

                //create an order for the cheapest supplier
                if (bestOption) {
                    const neededQuantity = stockItem.minQuantity - stockItem.quantity;
                    const orderQuantity = Math.max(neededQuantity, bestOption.minQuantity);
                    const newOrder = new Order({
                        supplierId: bestOption.supplierId,
                        supplierName: bestOption.supplierName,
                        items: [{
                            productId: bestOption.productId,
                            productName: bestOption.productName,
                            quantity: orderQuantity,
                        }],
                        status: "pending"
                    });

                    await newOrder.save();
                    autoOrderedProductNames.push(bestOption.productName);

                    //update the stock item quantity
                    const item = newOrder.items[0];
                    const stockItem = await Stock.findOne({ name: item.productName });
                    stockItem.quantity += item.quantity;
                    await stockItem.save();
                }
            }
        }

        res.status(200).json({ message: "Cash register data processed successfully", autoOrderedProductNames });
    } catch (error) {
        console.error("Error processing purchases:", error);
        res.status(500).json({ message: "Error processing cash register data" });
    }

};
