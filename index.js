function lookupDNS() {
  const domain = document.getElementById("domain").value;

  // Setează domeniul afișat
  document.getElementById("domainDisplay").innerHTML = 
    `Result for: <a href="https://${domain}" target="_blank">${domain}</a>`;

  // Ascunde eroarea, arată containerul
  document.getElementById("errorDisplay").classList.add("hidden");
  document.querySelector(".container2").classList.remove("hidden");

  fetch("index.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "domain=" + encodeURIComponent(domain)
  })
  .then(response => response.json())
  .then(data => {
    const container = document.querySelector(".container2");
    if (!container) return;

    if (data.status === 0) {
      document.getElementById("status").src = "/images/circle-check-solid.svg";

      // Șterge vechile rezultate
      container.querySelectorAll('.item').forEach(item => {
        item.querySelectorAll('.data.result').forEach(el => el.remove());
      });

      const promises = data.records.map(record => {
  return fetch("https://ipwho.is/" + record.ip)
    .then(response => response.json())
    .then(locationData => {
      const country_flag = locationData.flag.img;
      const owner = locationData.connection.org;

      const recordMap = {
        "Type": record.type,
        "Domain name": record.name,
        "TTL": record.ttl,
        "Address": record.ip,
        "Source": `<img src="${country_flag}" height="14" style="margin-left: 5px;"> ${owner}`
      };

            Object.entries(recordMap).forEach(([label, value]) => {
              const item = Array.from(container.querySelectorAll('.item'))
                .find(el => el.querySelector('.data1')?.textContent === label);
              if (item) {
                const newDiv = document.createElement("div");
                newDiv.className = "data result";
                newDiv.innerHTML = value;
                item.appendChild(newDiv);
              }
            });
          });
      });
          // 🟢 Când TOATE fetch-urile sunt gata:
      Promise.all(promises).then(() => {
        document.querySelector(".main_container").style.display = "block";
      });



    } else {
      // Eroare: DNS invalid
      document.getElementById("status").src = "/images/circle-xmark-solid-red.svg";
      document.querySelector(".container2").classList.add("hidden");
      document.querySelector(".errorDisplay").classList.remove("hidden");

      //const errorDiv = document.getElementById("errorDisplay");
      //errorDiv.classList.remove("hidden");
      //errorDiv.innerText = "DNS not found.";
    }
  })
  .catch(error => {
    console.error("Eroare:", error);
  });
}
