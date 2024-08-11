import { COMMON_URL } from "src/shared/constant"
import { ParamsDto } from "../../cms.dto";
import { mergeParams } from "src/shared/utility/utility";
import { Param } from '@nestjs/common';

const initialQuery: ParamsDto = {
    $expand: "plus_category",
    $count: true,
}

export const URL = (baseUrl: string) => `${baseUrl}${COMMON_URL}/plus_problemissues`;

export const PROBLEM_ISSUES_ENDPOINTS = {
    ALL_PROBLEM_ISSUES: {
        endpoint: (baseUrl: string) => URL(baseUrl),
        searchQuery: (query: ParamsDto) => mergeParams(initialQuery, query),
    },
}


