/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 89.36170212765957, "KoPercent": 10.638297872340425};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.84375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "17. POST /admin/api/v1/payment/query"], "isController": false}, {"data": [1.0, 500, 1500, "29. POST /admin/api/v1/notification/system/query"], "isController": false}, {"data": [1.0, 500, 1500, "3. POST /admin/api/v1/city/query"], "isController": false}, {"data": [1.0, 500, 1500, "6. POST /admin/api/v1/show/query"], "isController": false}, {"data": [1.0, 500, 1500, "16. POST /admin/api/v1/order/query"], "isController": false}, {"data": [0.5, 500, 1500, "1. POST /admin/api/v1/country/query"], "isController": false}, {"data": [1.0, 500, 1500, "36. POST /widget/api/v1/event/{eventId}/root-tickets"], "isController": false}, {"data": [1.0, 500, 1500, "20. POST /admin/api/v1/legalentity/query"], "isController": false}, {"data": [1.0, 500, 1500, "13. POST /admin/api/v1/discount/query"], "isController": false}, {"data": [1.0, 500, 1500, "AUTH - Authorize Callback"], "isController": false}, {"data": [1.0, 500, 1500, "11. POST /admin/api/v1/ticket/query"], "isController": false}, {"data": [1.0, 500, 1500, "38. GET /widget/api/v1/event/{eventId}/tickets"], "isController": false}, {"data": [1.0, 500, 1500, "26. POST /admin/api/v1/template-group/query"], "isController": false}, {"data": [1.0, 500, 1500, "28. POST /admin/api/v1/pushkaGateway/query"], "isController": false}, {"data": [1.0, 500, 1500, "23. POST /admin/api/v1/invitation/query"], "isController": false}, {"data": [0.0, 500, 1500, "27. POST /admin/api/v1/terminal/query"], "isController": false}, {"data": [1.0, 500, 1500, "37. POST /widget/api/v1/cart"], "isController": false}, {"data": [0.5, 500, 1500, "AUTH - Connect Authorize"], "isController": false}, {"data": [1.0, 500, 1500, "25. POST /admin/api/v1/paypoint/query"], "isController": false}, {"data": [0.0, 500, 1500, "40. POST /widget/api/v1/cart/{cartId}/root-ticket"], "isController": false}, {"data": [1.0, 500, 1500, "12. POST /admin/api/v1/quota/query"], "isController": false}, {"data": [1.0, 500, 1500, "9. POST /admin/api/v1/tariff/query"], "isController": false}, {"data": [1.0, 500, 1500, "19. POST /admin/api/v1/customer/query"], "isController": false}, {"data": [1.0, 500, 1500, "22. POST /admin/api/v1/user/query"], "isController": false}, {"data": [1.0, 500, 1500, "8. POST /admin/api/v1/age-raiting/query"], "isController": false}, {"data": [1.0, 500, 1500, "24. POST /admin/api/v1/gateway/query"], "isController": false}, {"data": [1.0, 500, 1500, "4. POST /admin/api/v1/venue/query"], "isController": false}, {"data": [0.0, 500, 1500, "15. POST /admin/api/v1/service-fee/query"], "isController": false}, {"data": [1.0, 500, 1500, "21. POST /admin/api/v1/contract/query"], "isController": false}, {"data": [1.0, 500, 1500, "5. POST /admin/api/v1/hall/query"], "isController": false}, {"data": [1.0, 500, 1500, "30. POST /admin/api/v1/sender-settings/query"], "isController": false}, {"data": [0.5, 500, 1500, "32. GET /widget/api/v1/show/{showId}"], "isController": false}, {"data": [1.0, 500, 1500, "33. POST /widget/api/v1/event/tabs/query"], "isController": false}, {"data": [1.0, 500, 1500, "AUTH - Submit Login"], "isController": false}, {"data": [1.0, 500, 1500, "34. POST /widget/api/v1/event/tabs/events/query"], "isController": false}, {"data": [1.0, 500, 1500, "7. POST /admin/api/v1/event/query"], "isController": false}, {"data": [1.0, 500, 1500, "2. POST /admin/api/v1/state/query"], "isController": false}, {"data": [0.0, 500, 1500, "41. POST /widget/api/v1/order"], "isController": false}, {"data": [1.0, 500, 1500, "AUTH - Get Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "10. POST /admin/api/v1/root-ticket/query"], "isController": false}, {"data": [1.0, 500, 1500, "35. GET /widget/api/v1/event/{eventId}"], "isController": false}, {"data": [1.0, 500, 1500, "39. GET /widget/api/v1/cart/{cartId}"], "isController": false}, {"data": [1.0, 500, 1500, "AUTH - Exchange Token"], "isController": false}, {"data": [1.0, 500, 1500, "31. POST /admin/api/v1/progressbar/query"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "14. POST /admin/api/v1/dealer-discount/query"], "isController": false}, {"data": [1.0, 500, 1500, "18. POST /admin/api/v1/cart/query"], "isController": false}, {"data": [0.0, 500, 1500, "AUTH - Full Login Flow"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 47, 5, 10.638297872340425, 206.36170212765956, 2, 1193, 148.0, 299.8000000000002, 809.9999999999999, 1193.0, 5.943348507840161, 196.28288797736468, 7.538721666350531], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 8.191747572815535, 15.729293082524272], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 1, 0, 0.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 24.595547566371682, 13.317547013274336], "isController": false}, {"data": ["3. POST /admin/api/v1/city/query", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 187.73724399717514, 8.651129943502825], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 8.012251420454547, 9.077592329545455], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 107.41849589100347, 5.913440743944637], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 1, 0, 0.0, 798.0, 798, 798, 798.0, 798.0, 798.0, 798.0, 1.2531328320802004, 4.869351112155388, 1.8711329104010024], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 7.12163397606383, 2.986826795212766], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 1457.5255594135804, 6.434059927983539], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 1, 0, 0.0, 132.0, 132, 132, 132.0, 132.0, 132.0, 132.0, 7.575757575757576, 331.9202769886364, 11.82232481060606], "isController": false}, {"data": ["AUTH - Authorize Callback", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 9.564271907216494, 8.70348743556701], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 651.41274143586, 6.092838921282798], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 66.0, 15.151515151515152, 5.1047585227272725, 7.5017755681818175], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 1, 0, 0.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 131.0, 7.633587786259541, 148.23622375954199, 11.972208969465647], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 5.038496376811594, 10.86248867753623], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 559.8366477272727, 15.842013888888888], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, 100.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 8.53259154040404, 16.137941919191917], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 1, 0, 0.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 112.0, 8.928571428571429, 4.385811941964286, 4.324776785714286], "isController": false}, {"data": ["AUTH - Connect Authorize", 1, 0, 0.0, 1193.0, 1193, 1193, 1193.0, 1193.0, 1193.0, 1193.0, 0.8382229673093042, 0.5230707774518022, 0.3135150356244761], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 293.987957150655, 6.814615174672489], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 1, 1, 100.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 20.408740942028988, 2.98629981884058], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 186.39964788732397, 10.83159110915493], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 1, 0, 0.0, 121.0, 121, 121, 121.0, 121.0, 121.0, 121.0, 8.264462809917356, 316.9469912190083, 12.332128099173554], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 1, 0, 0.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 433.90213815789474, 12.056508458646617], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 242.958984375, 15.390625], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 1, 0, 0.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 112.0, 8.928571428571429, 268.1187220982143, 13.785226004464285], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 260.5480515813253, 8.99496423192771], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 436.4876472513089, 8.006789921465968], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, 100.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 7.8305844907407405, 14.042607060185185], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 368.07105654761904, 9.172712053571429], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 1, 0, 0.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 148.0, 6.756756756756757, 274.42066089527026, 10.51784206081081], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 1, 0, 0.0, 145.0, 145, 145, 145.0, 145.0, 145.0, 145.0, 6.896551724137931, 369.5649245689655, 10.674838362068966], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 1, 0, 0.0, 818.0, 818, 818, 818.0, 818.0, 818.0, 818.0, 1.2224938875305624, 1.2189123624694378, 0.5945331601466993], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 1, 0, 0.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 140.0, 7.142857142857142, 4.206194196428571, 3.836495535714285], "isController": false}, {"data": ["AUTH - Submit Login", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 12.566137566137566, 5.270337301587301], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 1, 0, 0.0, 129.0, 129, 129, 129.0, 129.0, 129.0, 129.0, 7.751937984496124, 7.956334786821706, 4.693556201550387], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 475.74632185218974, 5.592067746350365], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 97.85038591867469, 9.230280496987952], "isController": false}, {"data": ["41. POST /widget/api/v1/order", 1, 1, 100.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 216.4644281914894, 5.561558067375887], "isController": false}, {"data": ["AUTH - Get Login Page", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 45.03242924528302, 2.123562794811321], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 22.942877435064933, 7.347470238095238], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 1, 0, 0.0, 151.0, 151, 151, 151.0, 151.0, 151.0, 151.0, 6.622516556291391, 11.123758278145695, 3.2271833609271523], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 7.204451650943397, 4.588001179245283], "isController": false}, {"data": ["AUTH - Exchange Token", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 8.199257425742573, 9.006613551980198], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.103701636904762, 17.822265625], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 2682.6171875, 0.0], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 202.8712040960452, 8.855270127118645], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 1, 0, 0.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 16.79168971238938, 13.723727876106194], "isController": false}, {"data": ["AUTH - Full Login Flow", 1, 0, 0.0, 1990.0, 1990, 1990, 1990.0, 1990.0, 1990.0, 1990.0, 0.5025125628140704, 8.069154365577889, 2.6774497487437188], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 4, 80.0, 8.51063829787234], "isController": false}, {"data": ["422/Unprocessable Entity", 1, 20.0, 2.127659574468085], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 47, 5, "500/Internal Server Error", 4, "422/Unprocessable Entity", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 1, 1, "422/Unprocessable Entity", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["41. POST /widget/api/v1/order", 1, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
