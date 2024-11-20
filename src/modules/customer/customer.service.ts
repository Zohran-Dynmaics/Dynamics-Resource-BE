import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";
import { HTTPS_METHODS } from "src/shared/enum";
import { generateHash, sendOtpToPhoneNumber } from "src/shared/utility/utility";
import { EnvironmentService } from "../admin/environment/environment.service";
import {
  ResendOtp,
  ResendOTPPurpose,
  UpdatePassword,
  VerifyOtp
} from "../auth/auth.dto";
import { CmsService } from "../cms/cms.service";
import { Customer } from "./customer.entity";
import { CreateCustomer, CustomerLogin } from "./dto";
const otpGenerator = require("otp-generator");

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
    private cmsService: CmsService,
    private envService: EnvironmentService,
    private jwtService: JwtService
  ) {}

  async getAllCustomers(): Promise<Customer[]> {
    try {
      return await this.customerModel.find({}).exec();
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<Customer> {
    try {
      return await this.customerModel.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Customer> {
    try {
      return await this.customerModel.findOne({ phoneNumber }).exec();
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Customer> {
    try {
      return await this.customerModel.findOne({ email }).exec();
    } catch (error) {
      throw error;
    }
  }

  async verifyPhoneNumber(phoneNumber: string): Promise<string> {
    try {
      const customer = await this.customerModel.findOne({ phoneNumber }).exec();
      if (customer && customer.downloadedOn !== null) {
        throw new HttpException(
          "Phone number already registered with an account. Login Please.",
          HttpStatus.BAD_REQUEST
        );
      }

      // const otp = otpGenerator.generate(4, {
      //   upperCaseAlphabets: false,
      //   lowerCaseAlphabets: false,
      //   specialChars: false
      // });

      // await sendOtpToPhoneNumber(
      //   phoneNumber,
      //   `Your Otp for phone verification is : ${otp}`
      // );

      if (!customer) {
        await this.customerModel.create({ phoneNumber, otp: "1234" });
      } else {
        customer.otp = "1234";
        await customer.save();
      }

      return "OTP Sent to your provided phone number";
    } catch (error) {
      throw error;
    }
  }

  async resendOtp(
    phoneNumber: string,
    purpose?: ResendOTPPurpose
  ): Promise<string> {
    try {
      const customer: any = await this.findByPhoneNumber(phoneNumber);

      if (!customer) {
        throw new HttpException(
          "Customer not found with provided phone number",
          HttpStatus.NOT_FOUND
        );
      }

      // const otp = otpGenerator.generate(4, {
      //   upperCaseAlphabets: false,
      //   lowerCaseAlphabets: false,
      //   specialChars: false
      // });
      const otp = "1234";

      // await sendOtpToPhoneNumber(
      //   phoneNumber,
      //   purpose == ResendOTPPurpose.VERIFY_CUSTOMER
      //     ? `Your account verification OTP is : ${otp}`
      //     : `OTP for reset password is : ${otp}`
      // );

      const updateRecord =
        purpose == ResendOTPPurpose.VERIFY_CUSTOMER
          ? {
              otp,
              verified: false
            }
          : {
              resetPasswordOtp: otp,
              resetPasswordOtpExpiry: new Date(new Date().getTime() + 3600)
            };
      await this.customerModel.findByIdAndUpdate(customer?._id, updateRecord);

      return "OTP Sent to your provided phone number";
    } catch (error) {
      throw error;
    }
  }

  async verifyCustomerOtp(phoneNumber: string, otp: string): Promise<string> {
    try {
      const customer = await this.customerModel.findOne({ phoneNumber }).exec();
      if (!customer)
        throw new HttpException(
          "Invalid phone number or OTP.",
          HttpStatus.BAD_REQUEST
        );
      if (customer.otp !== otp) throw new Error("Invalid OTP.");

      customer.otp = null;
      customer.verified = true;
      await customer.save();

      return "Customer verified successfully.";
    } catch (error) {
      throw error;
    }
  }

  async checkCRMCustomer(phoneNumber: string): Promise<any> {
    try {
      const customer = await this.customerModel.findOne({ phoneNumber }).exec();

      if (!customer) {
        throw new HttpException(
          "Please verify your phone number first.",
          HttpStatus.BAD_REQUEST
        );
      }

      const env = await this.envService.findByName(process.env.ENVIRONMENT);
      const crmToken = env?.token
        ? env.token
        : (await this.cmsService.getCrmToken(env)).access_token;
      const crmContact = await this.cmsService.getDynamicContent(
        env?.base_url,
        crmToken,
        `contacts?$filter=contains(mobilephone,'${phoneNumber}')&$count=true&$expand=plus_zone($select=msdyn_name),plus_building($select=msdyn_name),parentcustomerid_account,plus_floor($select=msdyn_name),plus_location($select=msdyn_name)&$top=1`
      );
      console.log(
        "🚀 ~ CustomerService ~ checkCRMCustomer ~ crmContact:",
        crmContact
      );
      if (crmContact.value.length >= 0) {
        customer.location =
          crmContact?.value?.[0]?.plus_location?.msdyn_name || null;
        customer.locationId =
          crmContact?.value?.[0]?.plus_location?.msdyn_functionallocationid ||
          null;

        customer.zone = crmContact?.value?.[0]?.plus_zone?.msdyn_name || null;

        customer.zoneId =
          crmContact?.value?.[0]?.plus_zone?.msdyn_functionallocationid || null;

        customer.building =
          crmContact?.value?.[0]?.plus_building?.msdyn_name || null;

        customer.buildingId =
          crmContact?.value?.[0]?.plus_building?.msdyn_functionallocationid ||
          null;

        customer.floor = crmContact?.value?.[0]?.plus_floor?.msdyn_name || null;

        customer.floorId =
          crmContact?.value?.[0]?.plus_floor?.msdyn_functionallocationid ||
          null;

        customer.accountId =
          crmContact?.value?.[0]?.parentcustomerid_account?.accountid || null;

        customer.account =
          crmContact?.value?.[0]?.parentcustomerid_account?.name || null;

        customer.email = crmContact?.value?.[0]?.emailaddress1 || null;
        customer.firstName = crmContact?.value?.[0]?.firstname;
        customer.lastName = crmContact?.value?.[0]?.lastname;
        customer.contactId = crmContact?.value?.[0]?.contactid;
        customer.address =
          crmContact?.value?.[0]?.address1_name || customer?.address;
        customer.customerNumber = crmContact?.value?.[0]?.plus_customernumber;

        await customer.save();
      }
      return {
        isNewCustomer: crmContact.value.length === 0,
        customer: customer
      };
    } catch (error) {
      throw error;
    }
  }

  async create(customer: CreateCustomer): Promise<Customer> {
    try {
      const checkCustomer: any = await this.findByPhoneNumber(
        customer?.phoneNumber
      );

      if (checkCustomer && !checkCustomer?.verified) {
        throw new HttpException(
          "Verify phone number first then create account.",
          HttpStatus.BAD_REQUEST
        );
      }

      if (customer?.isNewCustomer) {
        if (await this.customerModel.findOne({ email: customer?.email })) {
          throw new HttpException(
            "Email already registered with an account.",
            HttpStatus.BAD_REQUEST
          );
        }

        const fullName = customer?.fullName.trim().split(" ");
        checkCustomer.firstName = fullName[0];
        checkCustomer.lastName = fullName[1];
        checkCustomer.fullName = fullName.join("");
        checkCustomer.email = customer?.email.toLowerCase();
        checkCustomer.password = await generateHash(customer?.password);
        checkCustomer.area = customer?.area;
        checkCustomer.address = customer?.address;
        checkCustomer.building = customer?.building;
        checkCustomer.apartment = customer?.apartment;
        checkCustomer.downloadedOn = new Date();

        const contactCrmBody = {
          mobilephone: checkCustomer?.phoneNumber,
          firstname: fullName[0],
          lastname: fullName[1],
          emailaddress1: customer?.email.toLowerCase(),
          address1_name: customer?.address
        };

        const env = await this.envService.findByName(process.env.ENVIRONMENT);
        const crmToken = env?.token
          ? env.token
          : (await this.cmsService.getCrmToken(env)).access_token;

        await this.cmsService.CreateOrUpdateDynamicContent(
          env?.base_url,
          crmToken,
          "contacts",
          HTTPS_METHODS.POST,
          contactCrmBody
        );

        const crmContact = await this.cmsService.getDynamicContent(
          env?.base_url,
          crmToken,
          "contacts?$filter=contains(mobilephone,'" +
            checkCustomer?.phoneNumber +
            "')&$count=true&$top=1&$expand=parentcustomerid_account"
        );
        checkCustomer.contactId = crmContact?.value?.[0]?.contactid;
        // checkCustomer.accountId =
        //   crmContact?.value?.[0]?.parentcustomerid_account?.accountid;
      } else {
        checkCustomer.password = await generateHash(customer?.password);
        checkCustomer.address = customer?.address;
        checkCustomer.downloadedOn = new Date();
      }

      checkCustomer.verified = true;
      return await checkCustomer.save();
    } catch (error) {
      throw error;
    }
  }

  async requestForgetPassword(phoneNumber: string): Promise<string> {
    try {
      const customer: any = await this.findByPhoneNumber(phoneNumber);

      if (!customer) {
        throw new HttpException(
          "Customer not found with given email.",
          HttpStatus.NOT_FOUND
        );
      }

      //

      // const resetPasswordOtp = otpGenerator.generate(4, {
      //   upperCaseAlphabets: false,
      //   lowerCaseAlphabets: false,
      //   specialChars: false
      // });
      const resetPasswordOtpExpiry = new Date().setMinutes(
        new Date().getMinutes() + 3600
      );

      // await sendOtpToPhoneNumber(
      //   phoneNumber,
      //   `Your reset password otp is : ${resetPasswordOtp}`
      // );

      customer.resetPasswordOtp = "1234";
      customer.resetPasswordOtpExpiry = new Date(resetPasswordOtpExpiry);
      customer.resetPasswordRequested = true;
      await customer.save();

      return "OTP has been sent to your provided Phone Number.";
    } catch (error) {
      throw error;
    }
  }

  async verifyPassowrdOtp(verifyOtp: VerifyOtp): Promise<string> {
    try {
      const { phoneNumber, otp } = verifyOtp;
      const customer: any = await this.findByPhoneNumber(phoneNumber);
      if (!customer) {
        throw new HttpException(
          "Customer not found with given email.",
          HttpStatus.NOT_FOUND
        );
      }

      const { resetPasswordOtp, resetPasswordOtpExpiry } = customer;

      if (!resetPasswordOtp) {
        throw new HttpException(
          "You already verified OTP or not requested password update yet.",
          HttpStatus.BAD_REQUEST
        );
      }

      if (new Date().getTime() > resetPasswordOtpExpiry.getTime()) {
        throw new HttpException("OTP expired.", HttpStatus.BAD_REQUEST);
      }

      if (resetPasswordOtp !== otp) {
        throw new HttpException("Invalid OTP.", HttpStatus.BAD_REQUEST);
      }

      customer.resetPasswordOtp = null;
      customer.resetPasswordOtpExpiry = null;
      await customer.save();
      return "OTP verified successfully. You can change your password now.";
    } catch (error) {
      throw error;
    }
  }

  async update(
    updateCustomerDto: any,
    env?: any,
    user?: any
  ): Promise<Customer> {
    const { password = null, fullname } = updateCustomerDto;
    const { _id } = user;
    try {
      const customer: any = await this.findById(_id);
      console.log("🚀 ~ CustomerService ~ customer:", customer);
      if (!customer) {
        throw new HttpException(`Customer not found`, HttpStatus.NOT_FOUND);
      }
      if (password) {
        updateCustomerDto.password = await generateHash(password);
      }

      const env = await this.envService.findByName(process.env.ENVIRONMENT);
      if (!env) {
        throw new HttpException(`Environment not found`, HttpStatus.NOT_FOUND);
      }
      const crmToken = await this.cmsService.getCrmToken(env);

      await this.cmsService.CreateOrUpdateDynamicContent(
        env?.base_url,
        crmToken?.access_token,
        `contacts(${customer?.contactId})`,
        HTTPS_METHODS.PATCH,
        {
          ...(updateCustomerDto?.email && {
            emailaddress1: updateCustomerDto?.email.toLowerCase()
          }),
          ...(updateCustomerDto?.fullname && {
            firstname: updateCustomerDto?.fullname.split(" ")?.[0]
          }),
          ...(updateCustomerDto?.fullname && {
            lastname: updateCustomerDto?.fullname.split(" ")?.[1] || ""
          }),
          ...(updateCustomerDto?.phoneNumber && {
            mobilephone: updateCustomerDto?.phoneNumber
          })
        }
      );

      if (updateCustomerDto?.fullname) {
        customer.firstName = updateCustomerDto?.fullname.split(" ")?.[0];
        customer.lastName = updateCustomerDto?.fullname.split(" ")?.[1] || "";
      }
      customer.email =
        updateCustomerDto?.email?.toLowerCase() || customer.email;
      customer.phoneNumber =
        updateCustomerDto?.phoneNumber || customer.phoneNumber;

      return await customer.save();
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(updatePassword: UpdatePassword): Promise<Customer> {
    try {
      const { phoneNumber, password } = updatePassword;
      const customer: any = await this.findByPhoneNumber(phoneNumber);

      if (!customer) {
        throw new HttpException("Customer not found.", HttpStatus.NOT_FOUND);
      } else if (!customer.resetPasswordRequested) {
        throw new HttpException(
          "You have not requested update password yet. Please follow the password reset flow first.",
          HttpStatus.BAD_REQUEST
        );
      } else if (customer.resetPasswordRequested && customer.resetPasswordOtp) {
        throw new HttpException(
          "Please verify your otp first.",
          HttpStatus.BAD_REQUEST
        );
      }

      const hashedPassword: string = await generateHash(password);
      customer.password = hashedPassword;
      customer.resetPasswordRequested = null;
      return await customer.save();
    } catch (error) {
      throw error;
    }
  }

  async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async generateToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async login(loginDto: CustomerLogin): Promise<any> {
    try {
      const { phoneNumber, password, device, appName } = loginDto;
      let customer: any = await this.findByPhoneNumber(phoneNumber);

      if (!customer) {
        throw new HttpException("Customer not found", HttpStatus.NOT_FOUND);
      }

      if (!customer?.verified) {
        throw new HttpException(
          "Your account is not verified. Please sign up and complete the verification process to continue.",
          HttpStatus.BAD_REQUEST
        );
      }

      if (!customer?.downloadedOn) {
        throw new HttpException(
          "You have not completed the registration process yet. Please complete the registration process and then login.",
          HttpStatus.BAD_REQUEST
        );
      }

      if (!customer?.password) {
        throw new HttpException(
          "No password has been set for this account. Please use the 'Forgot Password' option to set your password and try again.",
          HttpStatus.BAD_REQUEST
        );
      }

      const isMatch = await this.comparePasswords(password, customer.password);

      if (!isMatch) {
        throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST);
      }

      const crmCustomer = await this.checkCRMCustomer(phoneNumber);

      if (crmCustomer.isNewCustomer) {
        await this.deleteAccount(customer?._id);
        throw new HttpException(
          "Customer not found in CRM with provided phone number. Please follow the register process.",
          HttpStatus.NOT_FOUND
        );
      }

      const env: any = await this.envService.findByName(
        process.env.ENVIRONMENT
      );

      customer.contactId = crmCustomer?.customer?.contactid;
      customer.appName = appName;
      customer.device = device;
      customer.lastActivity = new Date();

      const payload: any = {
        user: {
          _id: customer?._id,
          email: customer?.email,
          conatactId: crmCustomer?.customer.contactid,
          accountId: crmCustomer?.customer.parentcustomerid_account?.accountid,
          role: customer?.role
        },
        env: {
          _id: env?._id,
          base_url: env?.base_url,
          name: env?.env_name
        }
      };

      await customer.save();

      return {
        token: await this.generateToken(payload),
        customer: crmCustomer?.customer
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePasswordInternally(
    id: string,
    updatePassword
  ): Promise<Customer> {
    const { currentPassword, newPassword } = updatePassword;
    try {
      const customer = await this.customerModel.findById(id);
      if (!customer) {
        throw new HttpException(`Customer not found`, HttpStatus.NOT_FOUND);
      }

      const isMatch = await this.comparePasswords(
        currentPassword,
        customer.password
      );

      if (!isMatch) {
        throw new HttpException(
          "Invalid current password",
          HttpStatus.BAD_REQUEST
        );
      }

      const hashedPassword: string = await generateHash(newPassword);

      customer.password = hashedPassword;

      return await customer.save();
    } catch (error) {
      throw error;
    }
  }

  async deleteAccount(id: string): Promise<string> {
    try {
      const customer = this.findById(id);
      if (!customer) {
        throw new HttpException(`Customer not found`, HttpStatus.NOT_FOUND);
      }

      await this.customerModel.findByIdAndDelete(id);
      return "Customer deleted successfully.";
    } catch (error) {
      throw error;
    }
  }

  async getStats(): Promise<any> {
    try {
      const totalCustomers = await this.customerModel.find({}).exec();
      const activeCustomers = await this.customerModel
        .find({ verified: true })
        .exec();

      let android = 0;
      let ios = 0;

      activeCustomers.forEach((customer) => {
        if (customer?.device?.toLowerCase() == "android") android += 1;
        else if (customer?.device?.toLowerCase() == "ios") ios += 1;
      });

      return {
        total: totalCustomers.length,
        active: activeCustomers.length,
        deleted: 0,
        android,
        ios
      };
    } catch (error) {
      throw error;
    }
  }
}
