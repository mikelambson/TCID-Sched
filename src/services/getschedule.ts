export const getSchedule = async () => {
//   const response = await fetch('https://api.example.com/schedule');
//   return response.json();
    return {
        columns: [
            {
                Header: 'Order ID',
                accessor: 'orderId'
            },
            {
                Header: 'Customer Name',
                accessor: 'customerName'
            },
            {
                Header: 'Order Date',
                accessor: 'orderDate'
            },
            {
                Header: 'Total',
                accessor: 'total'
            }
        ],
        data: [
            {
                orderId: 1,
                customerName: 'John Doe',
                orderDate: '2021-01-01',
                total: 100.00
            },
            {
                orderId: 2,
                customerName: 'Jane Doe',
                orderDate: '2021-01-02',
                total: 200.00
            }
        ]
    };

}