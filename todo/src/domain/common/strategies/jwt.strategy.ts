import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import config from "src/infrastructure/config/config";
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Strategy for JWT
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //=============================================================================================================
  /**
   * Constructs the JWT strategy class
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${config.auth.key}`
    });
  }
  //=============================================================================================================
  /**
   * Validates JWT
   * @param payload The payload
   * @returns The user
   */
  async validate(payload: any) {
    return {
      id: payload.sub
    };
  }
  //=============================================================================================================
}
