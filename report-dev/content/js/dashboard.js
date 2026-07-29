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

    var data = {"OkPercent": 86.58536585365853, "KoPercent": 13.414634146341463};
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
    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 82, 11, 13.414634146341463, 189.670731707317, 76, 735, 151.5, 355.8, 409.09999999999997, 735.0, 12.828535669586984, 359.98962937069774, 17.019412693601375], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 2, 2, 100.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 19.801980198019802, 16.707920792079207, 32.14921101485148], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 2, 1, 50.0, 104.0, 76, 132, 104.0, 132.0, 132.0, 132.0, 12.987012987012989, 22.156554383116884, 19.588321834415584], "isController": false}, {"data": ["3. POST /admin/api/v1/city/query", 2, 0, 0.0, 191.5, 186, 197, 191.5, 197.0, 197.0, 197.0, 6.968641114982578, 231.5644054878049, 10.69455030487805], "isController": false}, {"data": ["6. POST /admin/api/v1/show/query", 2, 0, 0.0, 160.5, 154, 167, 160.5, 167.0, 167.0, 167.0, 7.547169811320755, 10.642688679245282, 12.083579009433961], "isController": false}, {"data": ["16. POST /admin/api/v1/order/query", 2, 0, 0.0, 330.0, 303, 357, 330.0, 357.0, 357.0, 357.0, 5.602240896358543, 173.91566001400562, 9.593290441176471], "isController": false}, {"data": ["1. POST /admin/api/v1/country/query", 2, 0, 0.0, 458.0, 314, 602, 458.0, 602.0, 602.0, 602.0, 2.7210884353741496, 10.573448129251702, 4.07233205782313], "isController": false}, {"data": ["36. POST /widget/api/v1/event/{eventId}/root-tickets", 2, 0, 0.0, 175.0, 174, 176, 175.0, 176.0, 176.0, 176.0, 9.1324200913242, 12.22263841324201, 5.128067922374429], "isController": false}, {"data": ["20. POST /admin/api/v1/legalentity/query", 2, 0, 0.0, 279.0, 148, 410, 279.0, 410.0, 410.0, 410.0, 4.878048780487805, 873.1993140243903, 7.643387957317073], "isController": false}, {"data": ["13. POST /admin/api/v1/discount/query", 2, 0, 0.0, 115.5, 102, 129, 115.5, 129.0, 129.0, 129.0, 9.30232558139535, 205.68677325581396, 14.548510174418604], "isController": false}, {"data": ["11. POST /admin/api/v1/ticket/query", 2, 0, 0.0, 379.5, 364, 395, 379.5, 395.0, 395.0, 395.0, 3.787878787878788, 846.3412198153409, 7.9290216619318175], "isController": false}, {"data": ["38. GET /widget/api/v1/event/{eventId}/tickets", 2, 0, 0.0, 100.0, 85, 115, 100.0, 115.0, 115.0, 115.0, 17.391304347826086, 7.345448369565217, 8.610733695652174], "isController": false}, {"data": ["26. POST /admin/api/v1/template-group/query", 2, 0, 0.0, 360.5, 317, 404, 360.5, 404.0, 404.0, 404.0, 4.914004914004914, 50.17899646805897, 7.723721590909092], "isController": false}, {"data": ["28. POST /admin/api/v1/pushkaGateway/query", 2, 0, 0.0, 258.5, 257, 260, 258.5, 260.0, 260.0, 260.0, 5.952380952380952, 3.2871791294642856, 8.943103608630953], "isController": false}, {"data": ["23. POST /admin/api/v1/invitation/query", 2, 0, 0.0, 137.0, 99, 175, 137.0, 175.0, 175.0, 175.0, 4.618937644341801, 151.0807592378753, 7.259941541570439], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 2, 2, 100.0, 109.5, 102, 117, 109.5, 117.0, 117.0, 117.0, 10.362694300518134, 8.753643134715025, 16.59144268134715], "isController": false}, {"data": ["37. POST /widget/api/v1/cart", 2, 0, 0.0, 97.5, 87, 108, 97.5, 108.0, 108.0, 108.0, 15.151515151515152, 7.4277935606060606, 7.339015151515151], "isController": false}, {"data": ["25. POST /admin/api/v1/paypoint/query", 2, 0, 0.0, 192.5, 187, 198, 192.5, 198.0, 198.0, 198.0, 10.101010101010102, 349.6291035353535, 15.797624684343434], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 2, 2, 100.0, 194.5, 181, 208, 194.5, 208.0, 208.0, 208.0, 9.615384615384617, 139.26814152644232, 5.943885216346154], "isController": false}, {"data": ["12. POST /admin/api/v1/quota/query", 2, 0, 0.0, 103.5, 93, 114, 103.5, 114.0, 114.0, 114.0, 8.849557522123893, 118.92025027654867, 13.641627488938052], "isController": false}, {"data": ["9. POST /admin/api/v1/tariff/query", 2, 0, 0.0, 119.5, 98, 141, 119.5, 141.0, 141.0, 141.0, 7.142857142857142, 168.38378906249997, 10.682896205357142], "isController": false}, {"data": ["19. POST /admin/api/v1/customer/query", 2, 0, 0.0, 158.0, 155, 161, 158.0, 161.0, 161.0, 161.0, 10.81081081081081, 400.1900337837838, 17.37225506756757], "isController": false}, {"data": ["22. POST /admin/api/v1/user/query", 2, 0, 0.0, 102.5, 93, 112, 102.5, 112.0, 112.0, 112.0, 4.47427293064877, 64.13852768456375, 6.9014786073825505], "isController": false}, {"data": ["8. POST /admin/api/v1/age-raiting/query", 2, 0, 0.0, 110.5, 104, 117, 110.5, 117.0, 117.0, 117.0, 6.968641114982578, 209.26339285714286, 10.783019381533101], "isController": false}, {"data": ["24. POST /admin/api/v1/gateway/query", 2, 0, 0.0, 344.5, 219, 470, 344.5, 470.0, 470.0, 470.0, 4.1928721174004195, 91.53072589098532, 6.274977070230608], "isController": false}, {"data": ["4. POST /admin/api/v1/venue/query", 2, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 6.896551724137931, 574.9595905172414, 10.570447198275863], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 2, 2, 100.0, 97.5, 91, 104, 97.5, 104.0, 104.0, 104.0, 12.658227848101266, 10.717464398734178, 19.24075356012658], "isController": false}, {"data": ["21. POST /admin/api/v1/contract/query", 2, 0, 0.0, 223.0, 165, 281, 223.0, 281.0, 281.0, 281.0, 3.8535645472061657, 122.1794466522158, 5.95157454238921], "isController": false}, {"data": ["5. POST /admin/api/v1/hall/query", 2, 0, 0.0, 145.0, 143, 147, 145.0, 147.0, 147.0, 147.0, 8.196721311475411, 332.9037525614754, 12.787365522540984], "isController": false}, {"data": ["30. POST /admin/api/v1/sender-settings/query", 2, 0, 0.0, 249.0, 188, 310, 249.0, 310.0, 310.0, 310.0, 6.024096385542169, 164.43312311746988, 9.344997176204819], "isController": false}, {"data": ["32. GET /widget/api/v1/show/{showId}", 2, 0, 0.0, 544.0, 353, 735, 544.0, 735.0, 735.0, 735.0, 2.5806451612903225, 2.569304435483871, 1.255040322580645], "isController": false}, {"data": ["33. POST /widget/api/v1/event/tabs/query", 2, 0, 0.0, 101.5, 101, 102, 101.5, 102.0, 102.0, 102.0, 14.084507042253522, 8.293904049295776, 7.564920774647888], "isController": false}, {"data": ["34. POST /widget/api/v1/event/tabs/events/query", 2, 0, 0.0, 123.5, 116, 131, 123.5, 131.0, 131.0, 131.0, 12.903225806451612, 13.243447580645162, 7.8125], "isController": false}, {"data": ["7. POST /admin/api/v1/event/query", 2, 0, 0.0, 312.5, 283, 342, 312.5, 342.0, 342.0, 342.0, 4.415011037527594, 576.2969094922737, 6.779887555187638], "isController": false}, {"data": ["2. POST /admin/api/v1/state/query", 2, 0, 0.0, 189.0, 167, 211, 189.0, 211.0, 211.0, 211.0, 6.666666666666667, 108.28125, 10.237630208333334], "isController": false}, {"data": ["41. POST /widget/api/v1/order", 2, 2, 100.0, 112.0, 95, 129, 112.0, 129.0, 129.0, 129.0, 12.903225806451612, 367.43951612903226, 10.118447580645162], "isController": false}, {"data": ["10. POST /admin/api/v1/root-ticket/query", 2, 0, 0.0, 135.5, 123, 148, 135.5, 148.0, 148.0, 148.0, 6.944444444444444, 36.79741753472223, 11.810302734375002], "isController": false}, {"data": ["35. GET /widget/api/v1/event/{eventId}", 2, 0, 0.0, 161.5, 152, 171, 161.5, 171.0, 171.0, 171.0, 10.256410256410257, 17.222556089743588, 4.997996794871795], "isController": false}, {"data": ["39. GET /widget/api/v1/cart/{cartId}", 2, 0, 0.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 109.0, 18.34862385321101, 14.012327981651376, 8.923451834862385], "isController": false}, {"data": ["31. POST /admin/api/v1/progressbar/query", 2, 0, 0.0, 111.5, 86, 137, 111.5, 137.0, 137.0, 137.0, 7.117437722419928, 205.00166814946618, 10.679631895017792], "isController": false}, {"data": ["14. POST /admin/api/v1/dealer-discount/query", 2, 0, 0.0, 142.5, 134, 151, 142.5, 151.0, 151.0, 151.0, 9.1324200913242, 167.38013698630138, 14.345212614155251], "isController": false}, {"data": ["18. POST /admin/api/v1/cart/query", 2, 0, 0.0, 148.0, 133, 163, 148.0, 163.0, 163.0, 163.0, 12.269938650306749, 17.206671779141104, 19.069929064417177], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 9, 81.81818181818181, 10.975609756097562], "isController": false}, {"data": ["422/Unprocessable Entity", 1, 9.090909090909092, 1.2195121951219512], "isController": false}, {"data": ["403/Forbidden", 1, 9.090909090909092, 1.2195121951219512], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 82, 11, "500/Internal Server Error", 9, "422/Unprocessable Entity", 1, "403/Forbidden", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["17. POST /admin/api/v1/payment/query", 2, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["29. POST /admin/api/v1/notification/system/query", 2, 1, "403/Forbidden", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["27. POST /admin/api/v1/terminal/query", 2, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["40. POST /widget/api/v1/cart/{cartId}/root-ticket", 2, 2, "500/Internal Server Error", 1, "422/Unprocessable Entity", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["15. POST /admin/api/v1/service-fee/query", 2, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["41. POST /widget/api/v1/order", 2, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
