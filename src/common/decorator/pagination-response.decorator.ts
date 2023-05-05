import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

// TODO: pageDto 사용할 수 있는 방법 있는지 확인
export const PaginationResponse = <Type extends new (...args: any[]) => any>(
  data: Type,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          // { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              page: {
                type: 'number',
              },
              offset: {
                type: 'number',
              },
              total: {
                type: 'number',
              },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(data) },
              },
            },
          },
        ],
      },
    }),
  );
};
