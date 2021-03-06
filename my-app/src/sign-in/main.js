const serverUrl = "https://hr43a6esr4uz.usemoralis.com:2053/server";
const appId = "is22QzmZcFDkWnf2YAOXqLsoSdt62ODzPGeLTUv4";
Moralis.start({ serverUrl, appId });

login = async () => {
    await Moralis.Web3.authenticate();{
      window.location.href = "dashboard.html";
    };
};

logout = async ()=>{
    await Moralis.User.logOut();
        console.log('Logged Out');
        window.location.href = "index.html";
}

getBalances = async () => {
    console.log("get balances clicked");
    const ethBalance = await Moralis.Web3API.account.getNativeBalance();
    const ropstenBalance = await Moralis.Web3API.account.getNativeBalance({ chain: "ropsten" });
    const rinkebyBalance = await Moralis.Web3API.account.getNativeBalance({ chain: "rinkeby" });
    console.log((ethBalance.balance / 1e18).toFixed(5) + " ETH");
    console.log((ropstenBalance.balance / 1e18).toFixed(5) + " ETH");
    console.log((rinkebyBalance.balance / 1e18).toFixed(5) + " ETH");

    let content = document.querySelector('#userBalances').innerHTML = `
    <table style="width: 100%; background-color: #F0EFF4; color: #280C3Cff;", class="table">
        <thead>
            <tr>
                <th scope="col">Chain</th>
                <th scope="col">Balance</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>Ether</th>
                <td>${(ethBalance.balance / 1e18).toFixed(5)} ETH</td>
            </tr>
            <tr>
                <th>Ropsten</th>
                <td>${(ropstenBalance.balance / 1e18).toFixed(5)} ETH</td>
            </tr>
            <tr>
                <th>Rinkeby</th>
                <td>${(rinkebyBalance.balance / 1e18).toFixed(5)} ETH</td>
            </tr>
        </tbody>
    </table>
    `;
}

getTransactions = async () => {
    console.log("get transactions clicked");
    const options = {
        chain: "rinkeby",
        address: Moralis.User.current().get("ethAddress"),
        order: "desc",
        from_block: "0",
      };
      const transactions = await Moralis.Web3API.account.getTransactions(options);
      console.log(transactions);

      if (transactions.total > 0) {
        let table = `
            <table style="width: 100%; background-color: #F0EFF4; color: #280C3Cff;", class="table">
            <thead>
            <tr>
            <th scope="col">Transaction</th>
            <th scope="col">Block Number</th>
            <th scope="col">Age</th>
            <th scope="col">Type</th>
            <th scope="col">Fee</th>
            <th scope="col">Value</th>
                </tr>
            </thead>
            <tbody id="theTransactions">
            </tbody>
            </table>
            `;
        document.querySelector("#tableOfTransactions").innerHTML = table;

        transactions.result.forEach(t => {
            let content = `
            <tr>
                <td><a href='https://rinkeby.etherscan.io/tx/${t.hash
                }' target="_blank" rel="noopener noreferrer">${t.hash}</a></td>
                <td><a href='https://rinkeby.etherscan.io/block/${t.block_number
                }' target="_blank" rel="noopener noreferrer">${t.block_number
                }</a></td>
                <td>${millisecondsToTime(
                    Date.parse(new Date()) - Date.parse(t.block_timestamp)
                )}</td>
                <td>${t.from_address == Moralis.User.current().get("ethAddress")
                    ? "Outgoing"
                    : "Incoming"
                }</td>
                <td>${((t.gas * t.gas_price) / 1e18).toFixed(5)} ETH</td>
                <td>${(t.value / 1e18).toFixed(5)} ETH</td>
            </tr>
            `;
            theTransactions.innerHTML += content;
        })
    }
}

millisecondsToTime = (ms) => {
    let minutes = Math.floor(ms / (1000 * 60));
    let hours = Math.floor(ms / (1000 * 60 * 60));
    let days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if (days < 1) {
        if (hours < 1) {
            if (minutes < 1) {
                return `Less than a minute ago`;
            } else return `${minutes} minutes(s) ago`;
        } else return `${hours} hours(s) ago`;
    } else return `${days} days(s) ago`;
};


if (document.querySelector("#btn-login") != null) {
    document.querySelector("#btn-login").onclick = login;
}
if(document.querySelector("#btn-logout") != null){
    document.querySelector("#btn-logout").onclick = logout;
}
if(document.querySelector("#get-balances-link") != null){
    document.querySelector("#get-balances-link").onclick = getBalances;
}
if(document.querySelector("#get-transactions-link") != null){
    document.querySelector("#get-transactions-link").onclick = getTransactions;
}

