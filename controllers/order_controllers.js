const db = require('../config/db')

exports.saveOrder = async (req, res) => {
    const { customerId, cardAmount, cashAmount, paymentMethod, grossTotal, discount, netTotal, orderItems } = req.body;
    if (!customerId || !cardAmount || !cashAmount || !paymentMethod || !grossTotal || !discount || !netTotal || !Array.isArray(orderItems)) {
        return res.status(200).json({
            status: false,
            message: "Mandatory fields are missing"
        })

    }
    const recieptNumber = generateReceiptNumber();
    const orderNumber = generateOrderNumber();
    const orderType = 'Counter Sale';
    const orderItemsJson = JSON.stringify(orderItems);
    try {
        const [rows] = await db.query('call saveOrder(?,?,?,?,?,?,?,?,?,?,?)', [customerId, cardAmount, cashAmount, paymentMethod, recieptNumber, orderType, orderNumber, grossTotal, discount, netTotal, orderItemsJson])
        return res.status(200).json({
            status: true,
            message: "Order Created Successfully",
            data: rows[0]
        })
    } catch (error) {  if (error.code === 'ER_SIGNAL_EXCEPTION') {
        return res.status(400).json({
            status: false,
            message: error.message
        });
    }
        return res.status(500).json({
            status: false,
            message: error
        })

    }

}
exports.getOrderByCustomer = async (req, res) => {
    const customerId = req.params.customerId;
    try {
        if (!customerId) {
            return res.status(200).json({
                status: false,
                message: "customerid must be provided"
            })

        }

        const [rows] = await db.query("CALL GetOrdersByCustomer(?)", [customerId]);
        return res.status(200).json({
            status: true,
            message: "Orders Fetched",
            data: rows[0]
        });
    } catch (error) {
      
        return res.status(500).json({
            status: false,
            message: error
        })

    }
}

const generateReceiptNumber = () => {
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `RCPT-${formattedDate}-${randomNumber}`;
};

const generateOrderNumber = () => {
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `ORD-${formattedDate}-${randomNumber}`;
};