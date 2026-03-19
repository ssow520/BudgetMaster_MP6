import React from "react";
import SummaryComponent from "../components/dashboard/SummaryComponent";

function Dashboard() {

    const transactions = [
        { type: "income", amount: 2000 },
        { type: "expense", amount: 500 },
        { type: "expense", amount: 300 }
    ];

    return (
        <div className="container mt-5">
            <h2>Dashboard</h2>
            <SummaryComponent transactions={transactions} />
        </div>
    );
}

export default Dashboard;
