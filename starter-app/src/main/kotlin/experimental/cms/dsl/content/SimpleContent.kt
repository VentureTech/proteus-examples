/*
 * Copyright (c) Interactive Information R & D (I2RD) LLC.
 * All Rights Reserved.
 *
 * This software is confidential and proprietary information of
 * I2RD LLC ("Confidential Information"). You shall not disclose
 * such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered
 * into with I2RD.
 */

package experimental.cms.dsl.content

import com.i2rd.cms.bean.contentmodel.CmsModelDataSet
import com.i2rd.cms.visibility.VisibilityConditionInstance
import experimental.cms.dsl.Content
import experimental.cms.dsl.ContentHelper
import experimental.cms.dsl.ContentInstance
import experimental.cms.dsl.Identifiable
import net.proteusframework.cms.PageElementModelImpl
import net.proteusframework.cms.component.ContentElement
import net.proteusframework.cms.component.generator.Generator

/**
 * Simple Content for a [com.i2rd.cms.component.simple.SimpleContentElement]
 * @author Russ Tennant (russ@venturetech.net)
 */
open class SimpleContent(id: String, val generator: Class<out Generator<*>>)
    : Identifiable(id), Content {
    override var visibilityCondition: VisibilityConditionInstance? = null
    override var path: String = ""
    override var htmlId: String = ""
    override var htmlClass: String = ""
    override val cssPaths = mutableListOf<String>()
    override val javaScriptPaths = mutableListOf<String>()
    override var parent: Any? = null
    var mds: CmsModelDataSet? = null

    override fun createInstance(helper: ContentHelper, existing: ContentElement?): ContentInstance {
        val contentElement = existing?:helper.run {
            val model = getSimplePageElementModelFactory().getVirtualComponents(getCmsSite()).first {
                PageElementModelImpl.StandardIdentifier(it.identifier).virtualIdentifier == generator.name
            }
            assignToSite(model.identifier)
            getSimplePageElementModelFactory().createInstance(model)
        }
        return if(mds != null) ContentInstance(contentElement, mds) else ContentInstance(contentElement)
    }

    override fun toString(): String {
        return "SimpleContent(" +
            "htmlId='$htmlId'," +
            "htmlClass='$htmlClass'," +
            "cssPaths=$cssPaths," +
            "javaScriptPaths=$javaScriptPaths" +
            ")"
    }
}
