import React from "react";

function SummaryComponent({ transactions }) {
    // Calcul des totaux
    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = totalIncome - totalExpense;

    return (
        <div className="card p-4 shadow">
            <h3>Budget Summary</h3>

            <p><strong>Total des entrées:</strong> ${totalIncome}</p>
            <p><strong>Total des depenses:</strong> ${totalExpense}</p>
            <p><strong>Balance:</strong> ${balance}</p>

            {balance > 0 && (
                <p className="text-success">Good job! You are saving money.</p>
            )}

            {balance < 0 && (
                <p className="text-danger">Warning! You are spending more than you earn.</p>
            )}

            {balance === 0 && (
                <p className="text-warning">Your balance is neutral.</p>
            )}
        </div>
    );
}

export default SummaryComponent;
