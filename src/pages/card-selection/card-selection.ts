import { Component } from '@angular/core';
import { IonicPage, NavParams, Platform, NavController } from 'ionic-angular';

import { ModalService } from '../../services/ModalService';
import { ApiProvider } from '../../providers/api/api';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2';

import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { HelperProvider } from '../../providers/helper/helper';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component(
{
    selector: 'page-card-selection',
    templateUrl: 'card-selection.html'
})
export class CardSelectionPage 
{
    purchase;
    amount: number;
    type;
    coupons; 
    user;

    public product: any = { name: 'Music app',
                            appleProductId: '1234',
                            googleProductId: 'com.awesong.musicapp.premium' 
                          };

    constructor(private navParams: NavParams,
                public modalService: ModalService,
                private api: ApiProvider,
                private platform: Platform,
                private store: InAppPurchase2,
                private payPal: PayPal,
                private helper: HelperProvider,
                private navCtrl: NavController) 
    {
        this.purchase = this.navParams.get('purchase');
    }

    close()
    {
        this.navCtrl.setRoot(TabsPage)
    }

    ionViewDidLoad() 
    {
        console.log('ionViewDidLoad CardSelectionPage');

        this.api.getUserById(localStorage.getItem('uid')).subscribe(res =>
        {
            this.user =res;
        })

        if(this.platform.is('ios'))
        {
            this.type = 'App Store'
        }
        else
        {
            this.type = 'Google Play'
        }

        this.configurePurchasing();

        this.api.getPayment().subscribe(res =>
        {
            this.purchase = res;
            console.log(res);
            this.amount = this.purchase.amount;
        })

        this.api.getAllCoupons().subscribe(res => 
        {
            this.coupons = res;
        })
    }

    configurePurchasing() 
    {
        if (!this.platform.is('cordova')) 
        { 
            return; 
        }
        
        let productId;
        
        try 
        {
            if (this.platform.is('ios')) 
            {
                productId = this.product.appleProductId;
            }
            else if (this.platform.is('android')) 
            {
                productId = this.product.googleProductId;
            }

            // Register Product
            // Set Debug High
            this.store.verbosity = this.store.DEBUG;
            // Register the product with the store
            this.store.register({ id: productId,
                                  alias: productId,
                                  type: this.store.NON_RENEWING_SUBSCRIPTION
                                });

            this.registerHandlers(productId);

            // this.store.ready().then((status) => {
            //   console.log(JSON.stringify(this.store.get(productId)));
            //   console.log('Store is Ready: ' + JSON.stringify(status));
            //   console.log('Products: ' + JSON.stringify(this.store.products));
            // });

            this.store.ready( status =>
            {
                console.log(JSON.stringify(this.store.get(productId)));
                console.log('Store is Ready: ' + JSON.stringify(status));
                console.log('Products: ' + JSON.stringify(this.store.products));
            })

            // Errors On The Specific Product
            this.store.when(productId).error( (error) => 
            {
                alert('An Error Occured' + JSON.stringify(error));
            });

            // Refresh Always
            console.log('Refresh Store');
            this.store.refresh();
        } 
        catch (err) 
        {
            console.log('Error On Store Issues' + JSON.stringify(err));
        }
    }

    registerHandlers(productId) 
    {
        // Handlers
        this.store.when(productId).approved( (product: IAPProduct) => 
        {
            // Purchase was approved
            product.finish();
        });

        this.store.when(productId).registered( (product: IAPProduct) => 
        {
            console.log('Registered: ' + JSON.stringify(product));
        });

        this.store.when(productId).updated( (product: IAPProduct) => 
        {
            console.log('Loaded' + JSON.stringify(product));
        });

        this.store.when(productId).cancelled( (product) => 
        {
            this.helper.presentToast('Payment Cancelled.');
        });

        // Overall Store Error
        this.store.error( (err) => 
        {
            this.helper.presentToast('Could not process payment.')
        });
    }

    async makepurchase() 
    {
        console.log('coming')
        /* Only configuring purchase when you want to buy, because when you configure a purchase
        It prompts the user to input their apple id info on config which is annoying */
        if (!this.platform.is('cordova')) { return };

        let productId;

        if (this.platform.is('ios')) 
        {
            productId = this.product.appleProductId;
        } 
        else if (this.platform.is('android')) 
        {
            productId = this.product.googleProductId;
        }

        console.log('Products: ' + JSON.stringify(this.store.products));
        console.log('Ordering From Store: ' + productId);
        
        try 
        {
            let product = this.store.get(productId);
            console.log('Product Info: ' + JSON.stringify(product));
            let order = await this.store.order(productId);
         
            order.then(res =>
            {
                this.user.premium.type = "premium";
                this.user.premium.payed = true;
                this.user.premium.date = new Date();
                localStorage.setItem('accountType','premium');
                this.helper.setAccountType('premium');
                this.api.updateUser(localStorage.getItem('uid'),this.user);
                this.helper.presentToast('Payment succesfull.');
            }, err =>
            {
                this.helper.presentToast('Payment Failed.');
            })
        } 
        catch (err) 
        {
            console.log('Error Ordering ' + JSON.stringify(err));
        }
    }

    paypalPurchase()
    {
        this.payPal.init(
        {
            PayPalEnvironmentProduction: 'AWV1hMZ_7B57aZcpfmh0JcgICoy81LV8UqNF_Wdl6dBy_Grx_TuMUyYa_Cq16RKZa_uZiayfh3gQy61P',
            PayPalEnvironmentSandbox: 'AYAI18UnSg3A0Pa-oK8HbcrDUW_A1xoPCEN0ZIx7SqNcSDlVsC6J_wvGHc-aRhn5hiRnKA0FLawGlrQV'
        }).then(() => 
        {
            // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
            this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration(
            {
                // Only needed if you get an "Internal Service Error" after PayPal login!
                //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
            })).then(() => 
            {
                let payment = new PayPalPayment(this.amount.toString(), 'USD', 'Description', 'sale');
                this.payPal.renderSinglePaymentUI(payment).then((res) => 
                {
                    this.user.premium.type = "premium";
                    this.user.premium.payed = true;
                    this.user.premium.date = new Date();
                    localStorage.setItem('accountType','premium');
                    this.helper.setAccountType('premium');
                    this.api.updateUser(localStorage.getItem('uid'),this.user);
                    this.helper.presentToast('Payment succesfull.');
                    // Successfully paid

                    // Example sandbox response
                    //
                    // {
                    //   "client": {
                    //     "environment": "sandbox",
                    //     "product_name": "PayPal iOS SDK",
                    //     "paypal_sdk_version": "2.16.0",
                    //     "platform": "iOS"
                    //   },
                    //   "response_type": "payment",
                    //   "response": {
                    //     "id": "PAY-1AB23456CD789012EF34GHIJ",
                    //     "state": "approved",
                    //     "create_time": "2016-10-03T13:33:33Z",
                    //     "intent": "sale"
                    //   }
                    // }
                }, (err) => 
                {
                    this.helper.presentToast('Payment Failed');    
                    // Error or render dialog closed without being successful
                });
            }, (err) => 
            {
                this.helper.presentToast('Payment Failed');

                // Error in configuration
            });
        }, (err) => 
        {
            this.helper.presentToast('Payment Failed');

            // Error in initialization, maybe PayPal isn't supported or something else
        });
    }

    myCoupon;

    addCoupon()
    {
        let myfunc = (res) =>
        {
            if(res.data)
            {
                let x = res.data;
                let Today = Date.now();
                let check: Array<any>;
        
                check = this.coupons.filter(data => data.name === x);
        
                if(check.length > 0)
                {
                    let date = new Date(check[0].date.toDate());
                 
                    if(date.getTime() > Today)
                    {
                        this.myCoupon = check[0];
                        this.helper.presentToast('Coupon Added!');
                        let discountAmount = (this.myCoupon.discount * this.amount) / 100;
                        this.amount = this.amount - discountAmount;
                    }
                    else
                        this.helper.presentToast('Coupon Expired');
                }
                else
                {
                    this.helper.presentToast('Coupon Not Valid');
                }
            }
        };
        
        const alert =  this.helper.showAlertGeneric('Coupons','Add a coupon','Enter Coupon','Submit',myfunc);
        alert.present();
    }
}
