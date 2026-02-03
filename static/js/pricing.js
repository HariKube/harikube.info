addonManager = typeof addonManager != "undefined" ? addonManager : function (feature, index, featIndex, op) {
    currentAddon = document.getElementById("addon-text-" + index + "-" + featIndex).innerHTML;

    current = 0;
    for (c in plans[index]["addons"][feature]) {
        if (plans[index]["addons"][feature][c]["text"] == currentAddon) {
            current = c;
            break;
        }
    }

    rmBtn = document.getElementById("addon-rm-" + index + "-" + featIndex);
    addBtn = document.getElementById("addon-add-" + index + "-" + featIndex);

    if (op == "+") {
        current++;
        if (current > 0) {
            rmBtn.style.opacity = 1;
            rmBtn.style.pointerEvents = '';
            rmBtn.style.cursor = '';
        }
        if (current + 1 == plans[index]["addons"][feature].length) {
            addBtn.style.opacity = 0.3;
            addBtn.style.pointerEvents = 'none';
            addBtn.style.cursor = 'not-allowed';
        }
    } else if (op == "-") {
        current--;
        if (current == 0) {
            rmBtn.style.opacity = 0.3;
            rmBtn.style.pointerEvents = 'none';
            rmBtn.style.cursor = 'not-allowed';
        }
        if (current < plans[index]["addons"][feature].length) {
            addBtn.style.opacity = 1;
            addBtn.style.pointerEvents = '';
            addBtn.style.cursor = '';
        }
    }

    document.getElementById("addon-text-" + index + "-" + featIndex).innerHTML = plans[index]["addons"][feature][current]["text"];

    price = parseInt(plans[index].price);
    for (featIndex in plans[index]["features"]) {
        currentAddon = document.getElementById("addon-text-" + index + "-" + featIndex).innerHTML;
        for (f in plans[index]["addons"]) {
            for (c in plans[index]["addons"][f]) {
                if (plans[index]["addons"][f][c]["text"] == currentAddon) {
                    price += parseInt(plans[index]["addons"][f][c]["price"]);
                }
            }
        }
    }

    if (plans[index].displayPrice) {
        document.getElementById("price-" + index).innerHTML = price;
    }
}

// orderBtns = document.getElementsByClassName("order-btn");
// for (var i = 1; i < orderBtns.length; i++) {
//     orderBtns[i].addEventListener("click", function (e) {
//         plan = parseInt(e.srcElement.id.replace("order-", ""), 10);

//         order = {
//             name: plans[plan]["name"],
//             price: document.getElementById("price-" + plan).innerHTML,
//             features: plans[plan]["features"]
//         };

//         for (f in order["features"]) {
//             order["features"][f] = document.getElementById("addon-text-" + plan + "-" + f).innerHTML
//         }

//         e.srcElement.href = plans[plan]["button"]["url"] + "#" + btoa(JSON.stringify(order));
//     });
// }