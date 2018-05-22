//
//  AntenaModel.swift
//  STB
//
//  Created by 沈凯 on 2018/5/4.
//  Copyright © 2018年 Ssky. All rights reserved.
//

import UIKit
import STBAPI

enum AntenaArrayType {
    case none
    case single
    case transponder
    case mixture
}

class AntenaModel: NSObject {
//    Title Name
    var title: String!
//    Array Type
    var arrayType: AntenaArrayType!
//    Sigle Array
    var sigleArray: [String]!
//    Transponder Array
    var transponderArray: [DatabaseTransponderModel]!
//    Mixture Array 1
    var mixtureArray1: [String]!
//    Mixture Array 2
    var mixtureArray2: [String]!
//    Index
    var index: Int!
}
