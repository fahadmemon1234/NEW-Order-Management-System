import React from "react";

import './Receipt.css';




function PrintReceipt(){
    return(
        <>

{/* <div className="card">
          <div className="card-body">


<div className="row">
    <div className="col-md-6 col-sm-6 col-lg-6">

<h5>Customer: </h5>

<h6>Invoice Date: </h6>

<h6>Invoice No: </h6>

    </div>
</div>

            </div>
            </div> */}



<div className="container">
    
    <div className="receipt_header">
    <h1>Receipt of Sale <span>Shop Name</span></h1>
    <h2>Address: Lorem Ipsum, 1234-5 <span>Tel: +1 012 345 67 89</span></h2>
    </div>
    
    <div className="receipt_body">

        <div className="date_time_con">
            <h5 style={{fontSize:'18px'}}>Customer: </h5>
            <h5 style={{fontSize:'18px'}}>Memon</h5>
        </div>

        <div className="date_time_con">
            <h5 style={{fontSize:'15px'}}>Invoice Date: </h5>
            <h5 style={{fontSize:'15px'}}>11:13:06 AM</h5>
        </div>

        <div className="date_time_con">
            <h5 style={{fontSize:'15px'}}>Invoice No: </h5>
            <h5 style={{fontSize:'15px'}}>1</h5>
        </div>

        <div className="items">
            <table>
        
                <thead>
                    <th style={{paddingLeft:'10px', width:'180px'}}>ITEM NAME</th>
                    <th style={{width:'80px'}}>QTY</th>
                    <th style={{width:'80px'}}>PRICE</th>
                    <th style={{paddingRight:'10px', width:'80px'}}>TOTAL</th>
                </thead>
        
                <tbody>
                    <tr>
                        <td>Ispaghol</td>
                        <td>5</td>
                        <td>Rs: 500</td>
                        <td>Rs: 2,500</td>
                    </tr>
                        <tr>
                            <td style={{borderBottom: '1px dashed #000', paddingTop:'5px'}}></td>
                            <td style={{borderBottom: '1px dashed #000', paddingTop:'5px'}}></td>
                            <td style={{borderBottom: '1px dashed #000', paddingTop:'5px'}}></td>
                            <td style={{borderBottom: '1px dashed #000', paddingTop:'5px'}}></td>
                        </tr>
                    <tr>
                        <td style={{paddingTop:'5px'}}>Ispaghol</td>
                        <td style={{paddingTop:'5px'}}>5</td>
                        <td style={{paddingTop:'5px'}}>Rs: 500</td>
                        <td style={{paddingTop:'5px'}}>Rs: 2,500</td>
                    </tr>

                </tbody>

                <tfoot>
                    <tr>
                        <td>Total</td>
                        <td></td>
                        <td></td>
                        <td>RS:2,500</td>
                    </tr>

                    <tr>
                        <td>TransPort Charges</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                    <tr>
                        <td>Labour Charges</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                    <tr>
                        <td>Discount</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                    <tr>
                        <td>Grand Total</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tfoot>

            </table>
        </div>

    </div>


    <h3>Thank You!</h3>

</div>

        </>
    )
}

export default PrintReceipt;