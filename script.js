
const connectBtn = document.getElementById("connectBtn");
const connectBtn2 = document.getElementById("connectBtn2");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");
const copyBtn = document.getElementById("copyBtn");
const contractAddress = document.getElementById("contractAddress");

let provider, signer, userAddress;

async function connectWallet() {
  try {
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
    } else {
      const wcProvider = new WalletConnectProvider.default({
        rpc: { 137: "https://polygon-rpc.com/" },
        chainId: 137
      });
      await wcProvider.enable();
      provider = new ethers.providers.Web3Provider(wcProvider);
    }

    let network = await provider.getNetwork();
    if (network.chainId !== 137) {
      alert("Please switch to Polygon Network!");
      return;
    }

    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    let balance = await provider.getBalance(userAddress);
    balance = ethers.utils.formatEther(balance);

    connectBtn.innerText = userAddress.slice(0, 6) + "..." + userAddress.slice(-4);
    connectBtn2.innerText = parseFloat(balance).toFixed(4) + " MATIC";
  } catch (err) {
    console.error(err);
    alert("Wallet connection failed!");
  }
}

connectBtn.addEventListener("click", connectWallet);
connectBtn2.addEventListener("click", connectWallet);

// Sidebar toggle
menuBtn.addEventListener("click", () => sidebar.classList.add("active"));
closeSidebar.addEventListener("click", () => sidebar.classList.remove("active"));

// Copy address
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(contractAddress.textContent);
  alert("Address copied!");
});

// Navigation
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

function showPage(pageId) {
  pages.forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  navItems.forEach(n => n.classList.remove("active"));
  document.querySelector(`[data-page="${pageId}"]`).classList.add("active");
}
navItems.forEach(item => {
  item.addEventListener("click", () => {
    showPage(item.dataset.page);
  });
});
